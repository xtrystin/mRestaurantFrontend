import React from 'react';
import { ApplicationPaths } from './AppRoutesConstants';
import { Counter } from '../components/Counter';
import { FetchData } from '../components/FetchData';
import { Home } from '../components/Home';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Products from '../components/products/Products';
import EditProduct from '../components/products/EditProduct';
import PolProducts from '../components/polproducts/PolProducts';
import EditPolProduct from '../components/polproducts/EditPolProduct';
import Storages from '../components/Storages/Storages';
import EditStorages from '../components/Storages/EditStorages';
import Pracownicy from '../components/Pracownicy/Pracownicy';
import EditPracownicy from '../components/Pracownicy/EditPracownicy';
import Dostawa from '../components/Dostawa/Dostawa';
import EditDostawa from '../components/Dostawa/EditDostawa';

export interface AppRoute {
    index?: boolean;
    path?: string;
    requireAuth?: boolean;
    allowedRoles?: string[];
    element: React.ReactNode;
}

const AppRoutes: AppRoute[] = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: ApplicationPaths.Counter,
        element: <Counter />,
    },
    {
        path: ApplicationPaths.Login,
        element: <Login />
    },
    {
        path: ApplicationPaths.LogOut,
        element: <Home />,
        requireAuth: true
    },
    {
        path: ApplicationPaths.Register,
        element: <Register />
    },
    {
        path: ApplicationPaths.FetchData,
        requireAuth: true,
        allowedRoles: ['admin', 'employee'],
        element: <FetchData />,
    },
    {
        path: ApplicationPaths.Products,
        requireAuth: true,
        element: <Products />,
    },
    {
        path: ApplicationPaths.ProductsEdit,
        requireAuth: true,
        element: <EditProduct />,
    },
    {
        path: ApplicationPaths.PolProducts,
        requireAuth: true,
        element: <PolProducts />,
    },
    {
        path: ApplicationPaths.PolProductsEdit,
        requireAuth: true,
        element: <EditPolProduct />,
    },
    {
        path: ApplicationPaths.Storages,
        requireAuth: true,
        element: <Storages />,
    },
    {
        path: ApplicationPaths.StoragesEdit,
        requireAuth: true,
        element: <EditStorages />,
    },
    {
        path: ApplicationPaths.Pracownicy,
        requireAuth: true,
        element: <Pracownicy />,
    },
    {
        path: ApplicationPaths.PracownicyEdit,
        requireAuth: true,
        element: <EditPracownicy />,
    },
    {
        path: ApplicationPaths.Dostawa,
        requireAuth: true,
        element: <Dostawa />,
    },
    {
        path: ApplicationPaths.DostawaEdit,
        requireAuth: true,
        element: <EditDostawa />,
    },
];

export default AppRoutes;
