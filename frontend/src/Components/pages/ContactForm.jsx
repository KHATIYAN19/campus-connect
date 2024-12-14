import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const ContactForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        {...register('phone')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        {...register('message')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ContactForm;