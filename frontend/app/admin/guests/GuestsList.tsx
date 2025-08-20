import React from 'react';

interface Guest {
    id: string;
    name: string;
    email: string;
    group: string;
    qrCode: string;
}

interface Props {
    guests: Guest[];
}

const GuestsList: React.FC<Props> = ({ guests }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Group</th>
                    <th>QR Code</th>
                </tr>
            </thead>
            <tbody>
                {guests.map((guest) => (
                    <tr key={guest.id}>
                        <td>{guest.name}</td>
                        <td>{guest.email}</td>
                        <td>{guest.group}</td>
                        <td>{guest.qrCode}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GuestsList;