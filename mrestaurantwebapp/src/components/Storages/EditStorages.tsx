import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import { useNavigate } from 'react-router-dom';

const EditStorages: React.FC = () => {
    const storageId = useParams().id;
    const navigate = useNavigate();

    const [storage, setStorage] = useState({
        name: '',
        location: '',
        shortcut: '',
    });


    useEffect(() => {
        // Fetch storage data based on storageId
        const fetchstorage = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/magazyn/${storageId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
                setStorage(data);
            } catch (error) {
                console.error('Error fetching storage:', error);
            }
        };

        fetchstorage();
    }, [storageId]);

    const handleInputChange = (e) => {
        setStorage({
            ...storage,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdatestorage = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/magazyn/${storageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(storage),
            });

            if (response.ok) {
                console.log('storage updated successfully');
                navigate("/storages");
            } else {
                console.error('Failed to update storage');
            }
        } catch (error) {
            console.error('Error updating storage:', error);
        }
    };

    return (
        <div>
            <h2>Edit storage</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formstorageName">
                    <Form.Label>Storage name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter storage name"
                        name="name"
                        value={storage.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formstorageLocation">
                    <Form.Label>Storage location</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter storage location"
                        name="location"
                        value={storage.location}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formstorageShort">
                    <Form.Label>Storage short name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter storage short name"
                        name="shortcut"
                        value={storage.shortcut}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleUpdatestorage}>
                    Update storage
                </Button>
            </Form>
        </div>
    );
};

export default EditStorages;
