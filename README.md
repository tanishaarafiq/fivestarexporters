# Five Star Exporters - Web Application

A professional, modern, and content-rich frontend website for Powerloom Spare Parts Exporters.

## Project Overview

This web application is designed to modernize the operations of **Five Star Exporters**, featuring:
-   **Public Facing Website**: Home, About, Modules, Contact.
-   **E-Commerce Features**: Catalogue, Product Details, Cart, Checkout.
-   **User Dashboard**: Order tracking, Profile management.
-   **Admin Dashboard**: Analytics, Management, Reports.

## Technology Stack

-   **Frontend**: React (Vite)
-   **Styling**: Vanilla CSS (Modern, Responsive, Themed)
-   **Routing**: React Router DOM
-   **Icons**: Lucide React

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Note: If you encounter PowerShell execution policy errors, use:*
    ```bash
    cmd /c "npm install"
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    *Note: If you encounter PowerShell execution policy errors, use:*
    ```bash
    cmd /c "npm run dev"
    ```

3.  **Open in Browser**:
    Click the link shown in the terminal (usually `http://localhost:5173`).

## Project Structure

-   `src/components`: Reusable UI components (Header, Footer, Layout).
-   `src/pages`: Individual page components covering all 10+ required sections.
-   `src/styles`: Global styles and theme variables.

## Troubleshooting

### PowerShell Execution Policy Error
If you see an error like `File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`, it means PowerShell is restricting script execution.

**Solution**:
Run the command using `cmd /c` to bypass PowerShell's restrictions without changing system settings:
```powershell
cmd /c "npm install"
cmd /c "npm run dev"
```

## Pages Included

1.  **Home**: Landing page with hero section and project overview.
2.  **About**: Institution, consultant, and team details.
3.  **Modules**: Detailed breakdown of system features.
4.  **Catalogue**: Spare parts listing with filters.
5.  **Product Details**: Detailed view with specs and action buttons.
6.  **Cart & Checkout**: Order management flow.
7.  **User Dashboard**: Customer portal.
8.  **Admin Dashboard**: Business analytics and management.
9.  **Reports**: Analytics visualization.
10. **Contact**: Enquiry form and FAQs.
11. **Login**: Authentication pages.

## Theme Colors
-   Navy Blue: #0A192F
-   Steel Grey: #B0B3B8
-   White: #FFFFFF
-   Subtle Gold: #FFD700
