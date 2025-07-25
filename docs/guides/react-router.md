# React Router

This guide describes how react router is used in this application.

## Router Mode

This application uses **React Router v7** in **data router mode** with `createBrowserRouter`.

Key details:

- **Version**: React Router v7.7.1
- **Mode**: Data Router with `createBrowserRouter` 
- **Import source**: `react-router` (not `react-router-dom`)
- **Router type**: Browser-based routing with nested routes
- **Layout pattern**: Uses `<Outlet />` components for nested route rendering

The router is configured with a root layout (`App`) and nested child routes, following React Router v7's recommended data router pattern rather than the legacy component-based routing.
