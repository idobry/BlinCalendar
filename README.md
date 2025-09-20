# Trading Journal Calendar

A Next.js web application that visualizes your stock trading data in a calendar format, similar to a trading journal. Upload your JSON trading data and see your profits/losses displayed in an intuitive calendar view.

## Features

- **Calendar View**: Visual representation of your trading days with color-coded profit/loss
- **Trading Statistics**: Complete overview of your trading performance
- **File Upload**: Easy JSON file upload with drag-and-drop support
- **Monthly Navigation**: Browse through different months of trading activity
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd trading-journal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Data Format

The application expects a JSON file with the following structure:

```json
[
  {
    "date": "2025-09-12",
    "symbol": "AAPL",
    "action": "buy",
    "shares": 10,
    "amount_usd": -1000.00
  },
  {
    "date": "2025-09-13",
    "symbol": "AAPL",
    "action": "sell",
    "shares": 10,
    "amount_usd": 1050.00
  }
]
```

### Field Descriptions

- `date`: Trading date in YYYY-MM-DD format
- `symbol`: Stock symbol (can be null for deposits/taxes)
- `action`: Type of action (`buy`, `sell`, `dividend`, `deposit`, etc.)
- `shares`: Number of shares (can be null for non-stock transactions)
- `amount_usd`: Dollar amount (negative for purchases, positive for sales)

## How It Works

1. **Data Processing**: The app matches buy and sell transactions for the same symbol to calculate completed trades
2. **Profit/Loss Calculation**: Calculates profit/loss for each completed trade
3. **Calendar Display**: Shows trading days in a calendar format:
   - **Green**: Profitable trading days
   - **Red**: Loss-making trading days
   - **Gray**: No completed trades

## Features Overview

### Trading Summary
- Total money invested
- Total wins and losses
- Win rate percentage
- Overall profit/loss
- Average profit per trade
- Return on investment

### Calendar View
- Monthly calendar display
- Color-coded trading days
- Profit/loss amounts per day
- Number of completed trades per day

### File Upload
- Drag and drop JSON files
- File validation
- Error handling with helpful messages

## Sample Data

A sample data file is included in the `public` folder (`sample-data.json`) that you can use to test the application.

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management

## Development

### Project Structure

```
src/
├── app/
│   └── page.tsx           # Main application page
├── components/
│   ├── Calendar.tsx       # Calendar component
│   ├── FileUpload.tsx     # File upload component
│   └── SummaryStats.tsx   # Statistics component
└── lib/
    ├── types.ts           # TypeScript interfaces
    └── tradeProcessor.ts  # Data processing logic
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
