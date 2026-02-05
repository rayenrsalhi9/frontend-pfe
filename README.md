# GED Frontend - Angular Application

An Angular 12 frontend application with real-time features, rich UI components, and WebSocket integration.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** >= 14.x (LTS recommended)
- **npm** >= 6.x (comes with Node.js)
- **Angular CLI** >= 12.x
- **Git** (for version control)

### Check Your Versions

```bash
node --version
npm --version
ng --version
```

## 🚀 Getting Started

Follow these steps to get the frontend application running locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli@12
```

### 3. Install Dependencies

```bash
npm install
```

This will install all the required packages defined in `package.json`, including:

- Angular 12.x framework
- Angular Material Components
- NGXS State Management
- Chart libraries (ApexCharts, Chart.js, NGX-Charts)
- Rich text editors (CKEditor, Jodit, Quill)
- WebSocket support (Socket.io, Pusher)
- And many other UI components

**Note:** The installation may take several minutes due to the large number of dependencies.

### 4. Environment Configuration

#### Copy the environment file:

```bash
cp .env.example .env
```

#### Configure the `.env` file with your local settings:

**API Configuration:**

```env
# Point to your local backend API
API_URL=http://127.0.0.1:8000/
```

**WebSocket Configuration:**

```env
WS_HOST=127.0.0.1
WS_PORT=6002
```

**Authentication:**

```env
TOKEN_EXPIRED_TIME_MIN=50
```

**Development Settings:**

```env
NODE_ENV=development
NG_CLI_ANALYTICS=ci
DEV_SERVER_PORT=4200
DEV_SERVER_HOST=localhost
```

**File Upload Configuration:**

```env
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=doc,docx,ppt,pptx,xls,xlsx,pdf,jpg,jpeg,png,gif,txt,csv,mp3,mp4,webm
```

### 5. Configure Environment Files

The application uses Angular environment files. Update them if needed:

- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`

Make sure the API URL and WebSocket settings match your `.env` configuration.

## 🏃 Running the Application

### Start the Development Server

```bash
npm start
```

Or use the Angular CLI directly:

```bash
ng serve
```

Or with custom port:

```bash
ng serve --port 4200 --open
```

The application will automatically open in your browser at `http://localhost:4200/`

**Note:** The initial compilation may take a few minutes. Subsequent changes will compile faster with hot module replacement.

### Alternative npm Scripts

```bash
# Start with auto-open browser
npm start

# Serve on specific port
npm run serve

# Build for development
npm run build

# Build for production
npm run build-prod

# Build with bundle analysis
npm run build-prod-state
npm run bundle-report
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

Or using Angular CLI:

```bash
ng test
```

This runs unit tests via [Karma](https://karma-runner.github.io/).

### Run End-to-End Tests

```bash
npm run e2e
```

Or using Angular CLI:

```bash
ng e2e
```

This executes end-to-end tests via [Protractor](http://www.protractortest.org/).

### Run Linting

```bash
npm run lint
```

Or using Angular CLI:

```bash
ng lint
```

## 🔧 Building for Production

### Standard Production Build

```bash
npm run build-prod
```

This creates an optimized production build in the `dist/` directory with:

- Ahead-of-Time (AOT) compilation
- Minification and uglification
- Tree-shaking to remove unused code
- Production environment configuration

### Production Build with Stats

```bash
npm run build-prod-state
```

This generates a production build with a `stats.json` file for bundle analysis.

### Analyze Bundle Size

After generating stats:

```bash
npm run bundle-report
```

This opens an interactive visualization of your bundle composition.

## 📦 Key Features

- **Angular 12** - Modern Angular framework
- **NGXS State Management** - Predictable state container
- **Real-time Communication** - WebSocket support via Socket.io and Pusher
- **Rich UI Components** - Material Design, Bootstrap 5, and custom components
- **Data Visualization** - Multiple chart libraries (ApexCharts, Chart.js, NGX-Charts)
- **Rich Text Editing** - CKEditor, Jodit, and Quill editors
- **Internationalization** - Multi-language support via ngx-translate
- **Responsive Design** - Mobile-first responsive layouts
- **PDF Viewer** - Built-in PDF viewing capabilities
- **Image Gallery** - Full-screen image viewing

## 🗂️ Project Structure

```
frontend/
├── e2e/                    # End-to-end tests
├── src/
│   ├── app/               # Application components and modules
│   │   ├── components/   # Reusable components
│   │   ├── services/     # Services and API calls
│   │   ├── models/       # TypeScript interfaces and models
│   │   └── ...
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── environments/     # Environment configurations
│   ├── styles.scss       # Global styles
│   ├── index.html        # Main HTML file
│   └── main.ts           # Application entry point
├── angular.json          # Angular CLI configuration
├── package.json          # npm dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── karma.conf.js         # Karma test configuration
```

## 🐛 Troubleshooting

### Common Issues

**Issue: `npm install` fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Issue: Port 4200 already in use**

```bash
# Use a different port
ng serve --port 4201
```

**Issue: Module not found errors**

```bash
# Ensure all dependencies are installed
npm install

# Clear Angular cache
rm -rf .angular
```

**Issue: Memory heap errors during build**

```bash
# Use the production build script with increased memory
npm run build-prod
```

**Issue: WebSocket connection errors**

- Verify the backend WebSocket server is running
- Check `WS_HOST` and `WS_PORT` in `.env`
- Ensure CORS is properly configured on the backend

**Issue: API connection errors**

- Verify the backend server is running at the URL specified in `API_URL`
- Check browser console for CORS errors
- Ensure the backend allows requests from `http://localhost:4200`

### Performance Tips

1. **Lazy Loading**: The application uses lazy loading for routes to improve initial load time
2. **Production Build**: Always use production builds for deployment (`npm run build-prod`)
3. **Bundle Analysis**: Regularly check bundle sizes with `npm run bundle-report`
4. **Caching**: Enable service workers for production deployments

## 🔄 Connecting to Backend

Ensure the backend Laravel application is running before starting the frontend:

1. Start the backend server: `php artisan serve` (usually on port 8000)
2. Start the WebSocket server: `php artisan websockets:serve` (usually on port 6001)
3. Update `.env` with correct `API_URL` and `WS_HOST`/`WS_PORT`
4. Start the frontend: `npm start`

## 📚 Documentation & Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [NGXS State Management](https://www.ngxs.io/)
- [Angular Material](https://material.angular.io/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)

## 🛠️ Development Tools

### Generate New Components

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Generate a new module
ng generate module module-name

# Other generators
ng generate directive|pipe|guard|interface|enum|class
```

### Code Scaffolding

The Angular CLI provides powerful code generation:

```bash
ng generate component my-component
ng generate service my-service
ng generate module my-module --routing
```

## 🔐 Security

- Never commit `.env` file to version control
- Keep dependencies updated: `npm audit` and `npm audit fix`
- Use environment variables for sensitive configuration
- Enable Content Security Policy (CSP) in production
- Sanitize user inputs to prevent XSS attacks

## 📝 License

This project is licensed under the MIT License.

---

## 🆘 Need Help?

- Check the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)
- Run `ng help` for Angular CLI commands
- Review the application documentation in the `docs/` folder (if available)
