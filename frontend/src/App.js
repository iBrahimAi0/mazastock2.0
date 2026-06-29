// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomSidebar from './composants/CustomSidebar';
import { useAuth } from './services/AuthContext';
import './axiosConfig'; 

import 'bootstrap/dist/css/bootstrap.min.css'; // Styles Bootstrap

import 'primereact/resources/themes/saga-blue/theme.css';  //theme
import 'primereact/resources/primereact.min.css';          //core css
import 'primeicons/primeicons.css';                        //icons


import './App.css';

import TableauDeBord from './composants/TableauDeBord';
import ProduitsEnStock from './composants/GestionStock/ProduitsEnStock';
import MouvementsStock from './composants/GestionStock/MouvementsStock';
import Entrepots from './composants/GestionStock/Entrepots';
import AjustementsStock from './composants/GestionStock/AjustementsStock';
import GestionProduits from './composants/GestionProduits';
import CommandeForm from './composants/GestionCommande/CommandeForm';
import CommandesList from './composants/GestionCommande/CommandesList';
import GestionFournisseurs from './composants/GestionFournisseurs';
import GestionClients from './composants/GestionClients';
import GestionCategories from './composants/GestionCategories';

import GestionCaisses from './composants/GestionCaisses/LaCaisses';
import LesVentes from './composants/GestionCaisses/LesVentes';

import Rapports from './composants/Rapports';
import Login from './composants/Login';

const App = () => {
    const { user } = useAuth(); // Destructuration correcte si useAuth() renvoie un objet

   /* if (!user) {
      return <Navigate to="/login" />;
    } */

   

  return (
    <div className="app-shell">
      {user && <CustomSidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={!user ? <Navigate to="/login" /> : <TableauDeBord />} />
          <Route path="/tableaudebord" element={!user ? <Navigate to="/login" /> : <TableauDeBord />} />
          <Route path="/produitsenstock" element={!user ? <Navigate to="/login" /> : <ProduitsEnStock />} />
          <Route path="/mouvementsstock" element={!user ? <Navigate to="/login" /> : <MouvementsStock />} />
          <Route path="/entrepots" element={!user ? <Navigate to="/login" /> : <Entrepots />} />
          <Route path="/ajustementsstock" element={!user ? <Navigate to="/login" /> : <AjustementsStock />} />
          <Route path="/gestionproduits" element={!user ? <Navigate to="/login" /> : <GestionProduits />} />
          <Route path="/commandeform" element={!user ? <Navigate to="/login" /> : <CommandeForm />} />
          <Route path="/listecommandes" element={!user ? <Navigate to="/login" /> : <CommandesList />} />
          <Route path="/gestionfournisseurs" element={!user ? <Navigate to="/login" /> : <GestionFournisseurs />} />
          <Route path="/gestionclients" element={!user ? <Navigate to="/login" /> : <GestionClients />} />
          <Route path="/gestioncategories" element={!user ? <Navigate to="/login" /> : <GestionCategories />} />
          <Route path="/gestioncaisses" element={!user ? <Navigate to="/login" /> : <GestionCaisses />} />
          <Route path="/lesventes" element={!user ? <Navigate to="/login" /> : <LesVentes />} />
          <Route path="/rapports" element={!user ? <Navigate to="/login" /> : <Rapports />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
