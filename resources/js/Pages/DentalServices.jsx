import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import DangerButton from '../Components/DangerButton';
import Modal from '../Components/Modal';
import TextInput from '../Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DentalServices() {
  const { services, auth } = usePage().props; // include auth for layout
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    id: null,
    name: '',
    description: '',
    price: ''
  });

  const handleSave = () => {
    if (data.id) {
      put(route('services.update', data.id), {
        onSuccess: () => {
          setShowModal(false);
          reset();
        }
      });
    } else {
      post(route('services.store'), {
        onSuccess: () => {
          setShowModal(false);
          reset();
        }
      });
    }
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      destroy(route('services.destroy', serviceToDelete.id), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setServiceToDelete(null);
        }
      });
    }
  };

  // Softer pastel colors for cards
  const cardColors = [
    "from-blue-50 to-blue-100 border-blue-200",
    "from-green-50 to-green-100 border-green-200",
    "from-pink-50 to-pink-100 border-pink-200",
    "from-orange-50 to-orange-100 border-orange-200",
    "from-purple-50 to-purple-100 border-purple-200",
    "from-teal-50 to-teal-100 border-teal-200",
    "from-red-50 to-red-100 border-red-200",
  ];

  return (
    
    <AuthenticatedLayout
    user={auth.user}
   
  >
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Page header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Dental Services</h2>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            Catalog
          </span>
        </div>


          <PrimaryButton onClick={() => {
            reset();
            setShowModal(true);
          }}>
            Add Service
          </PrimaryButton>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-3 gap-6">
          {services.map((service, index) => {
            const bgColor = cardColors[index % cardColors.length];
            return (
              <div
                key={service.id}
                className={`rounded-lg shadow-md p-6 text-gray-800 border bg-gradient-to-r ${bgColor}`}
              >
                <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                <p className="mt-2 text-gray-700">{service.description}</p>
                <p className="mt-3 text-blue-700 font-bold">{service.price}</p>

                <div className="flex gap-2 mt-4">
                  <SecondaryButton onClick={() => {
                    setData(service);
                    setShowModal(true);
                  }}>
                    Edit
                  </SecondaryButton>
                  <DangerButton onClick={() => {
                    setServiceToDelete(service);
                    setShowDeleteModal(true);
                  }}>
                    Delete
                  </DangerButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <div className="w-full p-6 rounded-lg shadow-md bg-gradient-to-r from-white to-gray-100 border border-gray-300">
            <div className="mb-4 border-b border-gray-200 pb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {data.id ? "Edit Service" : "Add Service"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill out the details below to {data.id ? "update" : "add"} a service.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Name
                </label>
                <TextInput
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <TextInput
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price
                </label>
                <TextInput
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400"
                  value={data.price}
                  onChange={e => setData('price', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-3">
              <PrimaryButton onClick={handleSave}>
                {data.id ? "Update Service" : "Save Service"}
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowModal(false)}>Cancel</SecondaryButton>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="p-8 rounded-lg shadow-md bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
            <h2 className="text-2xl font-bold text-red-700 mb-6">Confirm Delete</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <strong>{serviceToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <DangerButton onClick={confirmDelete}>Yes, Delete</DangerButton>
              <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
            </div>
          </div>
        </Modal>
      </div>
    </AuthenticatedLayout>
  );
}