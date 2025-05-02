import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';

function Store({ onStoreCreated }) {
    const [sellerName, setSellerName] = useState('');
    const [storeName, setStoreName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isStoreCreated, setIsStoreCreated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkAuth();
    }, []);

    const resetForm = () => {
        setSellerName('');
        setStoreName('');
        setPhoneNumber('');
        setImage(null);
        setTermsAccepted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to create a store");
            return;
        }

        if (!termsAccepted || !sellerName || !storeName || !phoneNumber || !image) {
            setError("Please fill all required fields and accept terms");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Check if the user already has a store
            const { data: existingSeller, error: sellerCheckError } = await supabase
                .from('sellers')
                .select('store_id')
                .eq('user_id', user.id)
                .single();

            if (sellerCheckError && sellerCheckError.code !== 'PGRST116') {
                throw sellerCheckError;
            }

            if (existingSeller) {
                setError("You already have a store. One account can only create one store.");
                return;
            }

            // 2. Upload store image
            const fileExt = image.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase
                .storage
                .from('store-images')
                .upload(fileName, image);

            if (uploadError) throw uploadError;

            // 3. Create store
            const { data: storeData, error: storeInsertError } = await supabase
                .from('stores')
                .insert([{
                    name: storeName,
                    phone_number: phoneNumber,
                    image_url: fileName,
                }])
                .select()
                .single();

            if (storeInsertError) throw storeInsertError;

            // 4. Link seller to store
            const { error: sellerInsertError } = await supabase
                .from('sellers')
                .insert([{
                    name: sellerName,
                    store_id: storeData.id,
                    user_id: user.id,
                }]);

            if (sellerInsertError) throw sellerInsertError;

            // ✅ All successful
            setIsStoreCreated(true);
            resetForm();

            if (typeof onStoreCreated === 'function') {
                onStoreCreated();
            }

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                <p>Please log in to create a store.</p>
            </div>
        );
    }

    if (isStoreCreated) {
        return (
            <div className="text-center p-6 bg-green-100 border border-green-400 text-green-700 rounded">
                <h2 className="text-2xl font-bold mb-4">Store Created Successfully!</h2>
                <p>Your store "{storeName}" has been created.</p>
            </div>
        );
    }

    return (
        <div className='max-w-2xl mx-auto p-4'>
            <h1 className='text-center text-2xl text-gray-700 border-b mb-6 pb-2'>
                Create Your Store
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className='block text-xl text-gray-700'>Seller Name</label>
                    <input
                        type='text'
                        placeholder='Seller Name'
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className='w-full px-3 py-2 border rounded-md'
                        required
                    />
                </div>
                <div>
                    <label className='block text-xl text-gray-700'>Store Name</label>
                    <input
                        type='text'
                        placeholder='Store Name'
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className='w-full px-3 py-2 border rounded-md'
                        required
                    />
                </div>
                <div>
                    <label className='block text-xl text-gray-700'>Phone Number</label>
                    <input
                        type='tel'
                        placeholder='+60-000-000-0'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className='w-full px-3 py-2 border rounded-md'
                        required
                    />
                </div>
                <div>
                    <label className='block text-xl text-gray-700'>Image Profile</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => setImage(e.target.files[0])}
                        className='w-full px-3 py-2 border rounded-md'
                        required
                    />
                </div>
                <div className='flex items-center space-x-4'>
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className='h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                    <label className='text-sm font-medium text-gray-700'>Accept terms and conditions</label>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
                    disabled={loading || !user}
                >
                    {loading ? 'Creating Store...' : 'Create My Store'}
                </button>
            </form>
        </div>
    );
}

export default Store;
