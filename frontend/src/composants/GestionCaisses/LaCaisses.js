import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaDoorOpen } from 'react-icons/fa';

const GestionCaisse = () => {
    const [ouvertures, setOuvertures] = useState([]);

    useEffect(() => {
        fetchOuvertures();
    }, []);

    const ouvrirCaisse = async () => {
        try {
            await axios.post('http://localhost:8000/api/ouvrir-caisse');
            fetchOuvertures(); // Rafraîchir la liste après chaque ouverture
        } catch (error) {
            console.error('Erreur lors de l\'ouverture de la caisse', error);
        }
    };

    const fetchOuvertures = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ouvertures-caisse');
            setOuvertures(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des ouvertures de caisse', error);
        }
    };

    return (
        <div className="p-m-3 mt-2 mb-2">
            <Button
                onClick={ouvrirCaisse}
                label="Ouvrir la Caisse"
                icon={<FaDoorOpen />} style={{ borderRadius: '20px' }}
                className="p-button-raised p-button-rounded p-button-help mb-2"
            />

            <DataTable value={ouvertures} responsiveLayout="scroll" paginator rows={10}>
                <Column field="id" header="ID" sortable></Column>
                <Column field="date_ouverture" header="Date" body={rowData => new Date(rowData.date_ouverture).toLocaleDateString()} sortable></Column>
                <Column field="date_ouverture" header="Heure" body={rowData => new Date(rowData.date_ouverture).toLocaleTimeString()} sortable></Column>
            </DataTable>
        </div>
    );
};

export default GestionCaisse;
