import React, { useEffect, useState } from 'react'
import { FaBox } from 'react-icons/fa'
import { supabase } from '../../supabase-client'


function TotalProduct() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('User not authenticated')
        }

        // First get the seller's store ID
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('store_id')
          .eq('user_id', user.id)
          .single()

        if (sellerError) throw sellerError
        if (!sellerData) {
          setTotalProducts(0)
          return
        }

        // Then count products for this store
        const { count, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', sellerData.store_id)

        if (productError) throw productError
        
        setTotalProducts(count || 0)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProductCount()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-600 p-6 rounded-lg text-white flex items-center animate-pulse">
        <div className="w-full h-8 bg-blue-500 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="bg-blue-600 p-6 rounded-lg text-white flex items-center transition-all hover:scale-105 hover:shadow-lg">
      <FaBox className="text-4xl mr-4" />
      <div>
        <h2 className="text-2xl font-bold">{totalProducts}</h2>
        <p className="text-sm opacity-90">Your Products</p>
      </div>
    </div>
  )
}

export default TotalProduct