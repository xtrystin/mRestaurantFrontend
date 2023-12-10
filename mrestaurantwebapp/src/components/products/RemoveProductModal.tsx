import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";

const RemoveProductModal = ({isVisible, setVisible, cell, setCell, product_name, product_id, ...args}) => {
    const [errorMsg, setErrorMsg] = useState("")

    const handleRemoveProduct = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/produkt/${product_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify({ "productId": product_id }),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                cell.getRow().delete();
                setErrorMsg("");
                setVisible(false);
            } else {
                console.error('Failed to update product');
                setErrorMsg("Failed to update product")
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setErrorMsg(`Error updating product: ${error}`)
        }
    };
    
    return (
      <Modal isOpen={isVisible} toggle={()=>setVisible(!isVisible)} onClosed={()=>setErrorMsg("")} {...args}>
        <ModalHeader toggle={()=>setVisible(!isVisible)}>Czy na pewno chcesz usunąć produkt?</ModalHeader>
        <ModalBody>
          <p className="fs-5">Produkt o nazwie: {product_name} zostanie usunięty.</p>
          <p className="fs-6">Czy jesteś tego pewny?</p>
          {errorMsg && <p className='text-danger'>{errorMsg}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={()=>handleRemoveProduct()}>
            Usuń
          </Button>{' '}
          <Button color="secondary" onClick={()=>setVisible(false)}>
            Anuluj
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

export default RemoveProductModal;
