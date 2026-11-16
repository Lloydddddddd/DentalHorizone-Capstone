<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class BillingController extends Controller
{
    public function index()
    {
        // Fetch all bills joined with the patient's name
        $bills = DB::table('bills')
            ->join('patients', 'bills.patient_id', '=', 'patients.id')
            ->select('bills.*', 'patients.patient_name')
            ->orderBy('bills.created_at', 'desc')
            ->get();

        // Format of the data
        $formattedBills = $bills->map(function ($bill) {
            
            // Get the specific items 
            $items = DB::table('bill_items')
                ->join('services', 'bill_items.service_id', '=', 'services.id')
                ->where('bill_items.bill_id', $bill->id)
                ->select('services.name', 'bill_items.quantity as qty', 'bill_items.unit_price', 'bill_items.teeth')
                ->get()
                ->map(function ($item) {
                    $item->teeth = $item->teeth
                        ? (json_decode($item->teeth, true) ?: [])
                        : [];

                    return $item;
                });

            // Get the payment history
            $payments = DB::table('payments')
                ->where('bill_id', $bill->id)
                ->orderBy('payment_date', 'desc')
                ->get();

            $mainService = $items->first()->name ?? 'Consultation';

            return [
                'id' => $bill->id,
                'patient_name' => $bill->patient_name,
                'service' => $mainService,
                'billing_date' => $bill->billing_date,
                'subtotal' => (float) $bill->subtotal,
                'discount' => (float) $bill->discount,
                'total_amount' => (float) $bill->total_amount,
                'amount_paid' => (float) $bill->amount_paid,
                'balance' => (float) $bill->balance,
                'payment_status' => $bill->payment_status,
                'items' => $items,
                'payments' => $payments,
            ];
        });

        return Inertia::render('Billing/Index', [
            'bills' => $formattedBills
        ]);
    }


    public function recordPayment(Request $request, $billId)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
        ]);

        // Get the current bill
        $bill = DB::table('bills')->where('id', $billId)->first();

        if (!$bill) {
            return back()->withErrors(['message' => 'Bill not found.']);
        }

        // Prevent overpayment
        if ($validated['amount'] > $bill->balance) {
            return back()->withErrors(['amount' => 'Payment amount cannot exceed the remaining balance.']);
        }

        // Insert the payment record
        DB::table('payments')->insert([
            'bill_id' => $bill->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'payment_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Calculate new totals
        $newAmountPaid = $bill->amount_paid + $validated['amount'];
        $newBalance = $bill->total_amount - $newAmountPaid;
        
        // Determine status
        $status = 'partial';
        if ($newBalance <= 0) {
            $status = 'paid';
            $newBalance = 0; 
        }

        // Update the bill
        DB::table('bills')->where('id', $bill->id)->update([
            'amount_paid' => $newAmountPaid,
            'balance' => $newBalance,
            'payment_status' => $status,
            'updated_at' => Carbon::now(),
        ]);

        return redirect()->back()->with('success', 'Payment recorded successfully.');
    }
}