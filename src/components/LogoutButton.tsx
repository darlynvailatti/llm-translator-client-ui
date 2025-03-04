import React from 'react';

const LogoutButton: React.FC = () => {
	const handleLogout = () => {
		sessionStorage.removeItem('token');
		window.location.href = '/login';
	};

	return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
