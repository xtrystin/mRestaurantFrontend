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
];

export default AppRoutes;
