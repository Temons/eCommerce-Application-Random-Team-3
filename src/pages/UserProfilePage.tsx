import React, { useEffect, useState } from 'react';
import { getCustomerProfile } from '../api/commerceToolsAuth';
import '../styles/UserProfilePage.scss';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCustomerProfile } from '../api/commerceToolsAuth';

interface Address {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

const UserProfilePage = () => {
  const { authToken } = useAuth();

  const [version, setVersion] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultBillingId, setDefaultBillingId] = useState<string | null>(null);
  const [defaultShippingId, setDefaultShippingId] = useState<string | null>(null);


  const [editMode, setEditMode] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (!authToken) return;
    const fetchProfile = async () => {

      try {
        const data = await getCustomerProfile(authToken);
        console.log('Customer data:', data);
        setVersion(data.version);
        setFirstName(data.firstName ?? '');
        setLastName(data.lastName ?? '');
        setDateOfBirth(data.dateOfBirth ?? '');
        setEmail(data.email ?? '');
        setAddresses(data.addresses || []);
        setDefaultBillingId(data.defaultBillingAddressId || null);
        setDefaultShippingId(data.defaultShippingAddressId || null);

        setNewFirstName(data.firstName ?? '');
        setNewLastName(data.lastName ?? '');
        setNewDateOfBirth(data.dateOfBirth ?? '');
        setNewEmail(data.email);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [authToken]);


  const handleSave = async () => {
    if (!authToken) return;

    if (!newFirstName.trim()) {
      toast.error('First name cannot be empty.');
      return;
    }
    if (!newLastName.trim()) {
      toast.error('Last name cannot be empty.');
      return;
    }
    if (!newEmail.trim()) {
      toast.error('Email cannot be empty.');
      return;
    }

    try {
      const { version: newVersion } = await updateCustomerProfile(authToken, {
  version,
  firstName: newFirstName,
  lastName: newLastName,
  dateOfBirth: newDateOfBirth,
  email: newEmail,
});


      setFirstName(newFirstName);
      setLastName(newLastName);
      setDateOfBirth(newDateOfBirth);
      setEmail(newEmail);
      setVersion(newVersion);

      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setNewFirstName(firstName);
    setNewLastName(lastName);
    setNewDateOfBirth(dateOfBirth);
    setNewEmail(email);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      <h1>User Profile</h1>

      <div className="personal-info">
        <h2>Personal Information</h2>
        {editMode && <p className="edit-notice">You are editing your profile</p>}


        {editMode ? (
          <div className='edit-mode-container'>
            <label>
              First Name:
              <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
            </label>
            <label>
              Last Name:
              <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
            </label>
            <label>
              Date of Birth:
              <input type="date" value={newDateOfBirth} onChange={(e) => setNewDateOfBirth(e.target.value)} />
            </label>
            <label>
              Email:
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </label>
            <button className="save-button" onClick={handleSave}>Save Changes</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
            <p><strong>Email:</strong> {email}</p>
            <button onClick={() => setEditMode(true)}>Edit</button>
          </>
        )}
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
              <div
                key={address.id}
                className={`address-block ${isBilling ? 'billing' : ''} ${isShipping ? 'shipping' : ''}`}
              >
                <p><strong>Street:</strong> {address.streetName}</p>
                <p><strong>City:</strong> {address.city}, {address.postalCode}</p>
                <p><strong>Country:</strong> {address.country}</p>
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
