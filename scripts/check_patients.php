<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$p = App\Models\Patient::orderBy('id','desc')->first();
if ($p) {
    echo json_encode($p->toArray(), JSON_PRETTY_PRINT);
} else {
    echo "NULL";
}
