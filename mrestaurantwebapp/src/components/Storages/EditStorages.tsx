import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import { useNavigate } from 'react-router-dom';

const EditStorages: React.FC = () => {
    const storageId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const [storage, setStorage] = useState({
        name: '',
        location: '',
        shortcut: '',
    });


    useEffect(() => {
        // Fetch storage data based on storageId
        let add = searchParams.get('add');
        if (add)
            return;

        const fetchstorage = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/magazyn/${storageId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
                setStorage(data);
            } catch (error) {
                console.error('Error fetching storage:', error);
                setErrorMsg("Error fetching storage: " + error);
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
        let add = searchParams.get('add');

        try {
            const response = await fetch(ApiUrl + (add ? `/api/magazyn` : `/api/magazyn/${storageId}`), {
                method: add ? 'POST' : 'PUT',
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
                setErrorMsg("Falied to update storage");
            }
        } catch (error) {
            console.error('Error updating storage:', error);
            setErrorMsg("Error updating storage: " + error);
        }
    };

    return (
        <div>
            <h2>Storage Data</h2>
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

                {errorMsg && <p className='text-danger'>{errorMsg}</p>}

                <Button variant="primary" onClick={handleUpdatestorage}>
                    Confirm
                </Button>
            </Form>
        </div>
    );
};

export default EditStorages;
