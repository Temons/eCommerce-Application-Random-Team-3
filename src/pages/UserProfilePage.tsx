import React, { useEffect, useState } from 'react';
import { getCustomerProfile } from '../api/commerceToolsAuth';
import '../styles/UserProfilePage.scss';

interface Address {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

const UserProfilePage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultBillingId, setDefaultBillingId] = useState<string | null>(null);
  const [defaultShippingId, setDefaultShippingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const data = await getCustomerProfile(token);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDateOfBirth(data.dateOfBirth);
        setAddresses(data.addresses || []);
        setDefaultBillingId(data.defaultBillingAddressId || null);
        setDefaultShippingId(data.defaultShippingAddressId || null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <div className="personal-info">
        <h2>Personal Information</h2>
        <p><strong>First Name:</strong> {firstName}</p>
        <p><strong>Last Name:</strong> {lastName}</p>
        <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
      </div>

      <div className="address-section">
        <h2>Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          addresses.map((address) => {
            const isBilling = address.id === defaultBillingId;
            const isShipping = address.id === defaultShippingId;

            return (
              <div key={address.id} className={`address-block ${isBilling ? 'billing' : ''} ${isShipping ? 'shipping' : ''}`}>
                <p>{address.streetName}</p>
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.country}</p>
                {isBilling && <span className="badge">Default Billing</span>}
                {isShipping && <span className="badge">Default Shipping</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
