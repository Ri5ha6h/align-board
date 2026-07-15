# LogiTrack Pro - Dashboard Documentation

## Overview

LogiTrack Pro is a comprehensive logistics and supply chain tracking dashboard that provides real-time monitoring and analytics across multiple transportation modes. The system offers detailed insights into carrier performance, status management, latency monitoring, and reference tracking for various logistics operations.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Transportation Modes](#transportation-modes)
3. [Dashboard Components](#dashboard-components)
4. [User Interface Features](#user-interface-features)
5. [Data Management](#data-management)
6. [Authentication & Security](#authentication--security)
7. [API Integration](#api-integration)
8. [Performance Monitoring](#performance-monitoring)

## System Architecture

### Technology Stack
- **Frontend**: Next.js 15.3.4 with React 19.1.0
- **Styling**: Tailwind CSS 4.1.10 with shadcn/ui components
- **State Management**: TanStack Query (React Query) 5.81.2
- **Data Tables**: TanStack Table 8.21.3
- **Forms**: React Hook Form 7.58.1 with Zod validation
- **Charts**: Recharts 3.0.0
- **Authentication**: JWT with bcryptjs
- **Development**: TypeScript, Biome (linting/formatting)

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Main dashboard routes
│   ├── signin/            # Authentication pages
│   └── signup/
├── components/             # React components
│   ├── tracking/          # Dashboard-specific components
│   ├── ui/                # shadcn/ui components
│   └── table/             # Table components
├── actions/               # Server actions
├── utils/                 # Utilities and schemas
└── hooks/                # Custom React hooks
```

## Transportation Modes

The system supports 7 different transportation modes, each with specific configurations:

### 1. Ocean Shipping
- **Carriers**: Major ocean shipping lines (MSC, Maersk, CMA CGM, etc.)
- **Reference Types**: Booking, Bill of Lading, Container
- **Queues**: Normal, Adaptive, Reference Not Found (RNF)
- **Performance Thresholds**: 
  - Avg Age: ≥90 days (warning)
  - Duration: ≥90 minutes (warning)
  - RNF Rate: >20% (warning)
  - Diff Rate: ≥10% (warning)

### 2. Air Cargo
- **Carriers**: Airlines and air cargo operators
- **Reference Types**: AWB (Air Waybill)
- **Queues**: Normal, Reference Not Found (RNF)
- **Performance Thresholds**:
  - Avg Age: ≥14 days (warning)
  - Duration: ≥60 minutes (warning)
  - RNF Rate: >5% (warning)
  - Diff Rate: ≥20% (warning)

### 3. Terminal Operations
- **Terminals**: Port and terminal operators
- **Reference Types**: Import, Export
- **Queues**: Normal, Reference Not Found (RNF)

### 4. Road Transportation
- **Carriers**: Trucking companies
- **Reference Types**: LTL (Less Than Truckload), FTL (Full Truckload)
- **Queues**: Normal, Reference Not Found (RNF)

### 5. Intermodal
- **Carriers**: Rail and intermodal operators
- **Reference Types**: INTMD (Intermodal)
- **Queues**: Normal, Reference Not Found (RNF)

### 6. Freight
- **Carriers**: Freight forwarders
- **Reference Types**: HAWB (House Air Waybill)
- **Queues**: Normal, Reference Not Found (RNF)

### 7. Load
- **Carriers**: Load management companies
- **Reference Types**: LOAD
- **Queues**: Normal

## Dashboard Components

### 1. Summary Dashboard
**Purpose**: Provides comprehensive overview of carrier performance and system health.

**Features**:
- **Carrier Selection**: Multi-select dropdown with up to 5 carriers
- **Queue Filtering**: Normal, Adaptive, RNF queues
- **Date Range**: Optional date filtering (enabled for single carrier selection)
- **Performance Metrics**:
  - Active tracking counts
  - Average age of shipments
  - Last run timestamps
  - Duration of operations
  - Success rates and ratios
  - Reference Not Found (RNF) counts
  - Failure rates with detailed breakdown
  - Difference rates (data changes)
  - Crawl frequency
  - Hit rates for adaptive queues

**Data Columns**:
- Carrier/Terminal
- Queue Type
- Active Count
- Average Age
- Last Run
- Duration
- Success Rate
- RNF Count
- Failure Count
- Difference Rate
- Crawl Frequency
- Duration to Launch
- Deliver Count
- Close Count
- Client Timeout
- Hit Rate
- Scheduler ID
- Start/End Times

### 2. Status Dashboard
**Purpose**: Manages operational status and issues across carriers.

**Features**:
- **Status Management**: Create, edit, close, and delete status entries
- **Status Types**: 
  - INFORMATION (Blue)
  - WEBSITE MAINTENANCE (Teal)
  - SYSTEM MAINTENANCE (Yellow)
  - DEGRADATION (Orange)
  - OUTAGE (Red)
- **Status States**: Active and Closed
- **Issue Tracking**: Detailed issue descriptions and impact assessments
- **Expected Resolution**: ETA for issue resolution

**Data Columns**:
- Carrier/Terminal
- Status (Active/Closed)
- Issue Description
- Impact Assessment
- Status Type
- Expected Resolution Date
- Created At
- Actions (View Details, Edit, Close, Delete)

### 3. Latency Dashboard
**Purpose**: Monitors response times and performance across different time intervals.

**Features**:
- **Carrier Selection**: Multi-select with up to 5 carriers
- **Queue Filtering**: Normal, Adaptive, RNF
- **Reference Type Filtering**: Mode-specific reference types
- **Time Interval Analysis**: 
  - 0-1 hours
  - 1-2 hours
  - 2-4 hours
  - 4-8 hours
  - 8-12 hours
  - 12-16 hours
  - 16-24 hours
  - 24-48 hours
  - 48-120 hours
  - >5 days (highlighted in red)

**Data Columns**:
- Carrier/Terminal
- Reference Type
- Queue Type
- Total Count
- Time Interval Breakdowns

### 4. Reference Dashboard
**Purpose**: Manages reference tracking and subscriptions.

**Features**:
- **Three Main Tabs**:
  - **All References**: Complete reference overview
  - **Subscription**: Subscription management
  - **Reference**: Individual reference tracking
- **Reference Types**: Mode-specific reference types
- **Status Filtering**: Active, Inactive, All
- **Bucket Management**: Reference categorization

### 5. History Dashboard
**Purpose**: Provides historical data analysis and trend monitoring.

**Features**:
- **Historical Data**: Past performance and changes
- **Trend Analysis**: Performance over time
- **Difference Tracking**: Changes in data over time
- **Time-based Filtering**: Date range selection

### 6. Induced Dashboard
**Purpose**: Advanced analytics and induced performance metrics (Ocean mode only).

**Features**:
- **Induced Analytics**: Advanced performance metrics
- **Chart Visualizations**: Graphical data representation
- **Performance Insights**: Deep dive into carrier performance
- **Availability**: Limited to Ocean transportation mode

## User Interface Features

### Navigation
- **Main Dashboard**: Mode selection with visual icons
- **Breadcrumb Navigation**: Clear path indication
- **Tab-based Interface**: Organized content sections
- **Responsive Design**: Mobile and desktop optimized

### Data Visualization
- **Interactive Tables**: Sortable, filterable data tables
- **Color-coded Status**: Visual status indicators
- **Performance Alerts**: Color-coded warnings and errors
- **Tooltips**: Detailed information on hover
- **Charts and Graphs**: Recharts integration for data visualization

### Form Management
- **Multi-select Dropdowns**: Carrier and terminal selection
- **Date Range Pickers**: Calendar-based date selection
- **Validation**: Real-time form validation with error messages
- **Auto-save**: Query parameter persistence

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## Data Management

### Real-time Updates
- **Live Data**: Real-time carrier status updates
- **Auto-refresh**: Configurable refresh intervals
- **Manual Refresh**: On-demand data updates
- **Error Handling**: Graceful error management

### Data Persistence
- **URL Parameters**: State persistence in URLs
- **Local Storage**: User preferences and settings
- **Session Management**: Secure user sessions
- **Query Caching**: Optimized data fetching

### Data Validation
- **Schema Validation**: Zod-based validation
- **Type Safety**: TypeScript throughout
- **Error Boundaries**: Graceful error handling
- **Data Sanitization**: Input sanitization and validation

## Authentication & Security

### User Management
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs encryption
- **Session Management**: Secure cookie handling
- **User Roles**: Role-based access control

### Security Features
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Cross-site scripting prevention
- **Input Validation**: Comprehensive input validation
- **Rate Limiting**: API rate limiting
- **Secure Headers**: Security header implementation

### Access Control
- **Route Protection**: Middleware-based route protection
- **Public Routes**: Sign-in and sign-up pages
- **Private Routes**: Dashboard and tracking pages
- **Redirect Logic**: Automatic redirect handling

## API Integration

### External API Communication
- **REST API Integration**: Axios-based HTTP client
- **Authentication**: Basic auth with username/password
- **Timeout Handling**: 120-second request timeout
- **Error Management**: Comprehensive error handling
- **Response Processing**: Data transformation and validation

### Server Actions
- **Next.js Server Actions**: Server-side function execution
- **Data Fetching**: Optimized data retrieval
- **Caching**: Intelligent data caching
- **Background Updates**: Asynchronous data processing

### Data Flow
1. **User Input**: Form submissions and selections
2. **Query Building**: Dynamic query parameter construction
3. **API Requests**: External API communication
4. **Data Processing**: Response transformation and validation
5. **UI Updates**: Real-time interface updates

## Performance Monitoring

### Key Performance Indicators (KPIs)
- **Success Rate**: Percentage of successful operations
- **Average Age**: Average age of tracked items
- **Duration**: Operation execution time
- **RNF Rate**: Reference Not Found percentage
- **Failure Rate**: System failure percentage
- **Difference Rate**: Data change percentage
- **Hit Rate**: Cache hit percentage

### Performance Thresholds
- **Ocean Mode**:
  - Avg Age: ≥90 days (warning)
  - Duration: ≥90 minutes (warning)
  - RNF Rate: >20% (warning)
  - Diff Rate: ≥10% (warning)
- **Air Mode**:
  - Avg Age: ≥14 days (warning)
  - Duration: ≥60 minutes (warning)
  - RNF Rate: >5% (warning)
  - Diff Rate: ≥20% (warning)

### Monitoring Features
- **Real-time Alerts**: Color-coded performance warnings
- **Trend Analysis**: Historical performance tracking
- **Comparative Analysis**: Multi-carrier performance comparison
- **Custom Thresholds**: Configurable warning levels

## Usage Guidelines

### Best Practices
1. **Carrier Selection**: Limit to 5 carriers for optimal performance
2. **Date Filtering**: Use date ranges for focused analysis
3. **Queue Management**: Monitor RNF queues for data quality
4. **Performance Monitoring**: Regular review of KPIs
5. **Status Updates**: Timely status management for operational issues

### Troubleshooting
- **Data Loading Issues**: Check carrier selection and network connectivity
- **Performance Warnings**: Review threshold settings and carrier performance
- **Authentication Issues**: Verify credentials and session validity
- **API Errors**: Check external API availability and configuration

### Support
- **Documentation**: Comprehensive inline help and tooltips
- **Error Messages**: Clear error descriptions and resolution steps
- **User Feedback**: Built-in feedback mechanisms
- **Help Resources**: Contextual help and documentation links

---

*This documentation provides a comprehensive overview of the LogiTrack Pro dashboard system. For technical implementation details, refer to the source code and component documentation.*
