'use client'
import axios from 'axios';
import React, { useEffect } from 'react'

const DeliveryBoyDashboard = () => {


    const getAssignments = async () => {
        try {
            const response = await axios.get('/api/delivery/get-assignments');
            console.log({ response: response?.data });
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }

    useEffect(() => {
        getAssignments();
    }, []);
    return (
        <div>DeliveryBoyDashboard</div>
    )
}

export default DeliveryBoyDashboard