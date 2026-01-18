# Architecture

This project is built as a Single Page Application (SPA) using Vanilla JavaScript and Vite.

## Tech Stack
- **Build Tool**: [Vite](https://vitejs.dev/) - chosen for speed and lightweight configuration.
- **Core**: Vanilla JavaScript (ES Modules).
- **Styling**: Native CSS3 with CSS Variables for theming.

## Project Structure

```
subnet_calculator/
├── index.html      # Entry point
├── main.js         # UI logic and event handling
├── subnet.js       # Core calculation domain logic (pure functions)
├── style.css       # Global styles and component styling
└── public/         # Static assets
```

## Logic Separation
- `subnet.js`: Contains `IPv4` and `IPv6` objects. These are stateless and pure, taking inputs (IP, CIDR) and returning a data object.
- `main.js`: Handles DOM manipulation, event listeners, and calls `subnet.js`. It renders HTML strings based on the results.

This separation allows for easy unit testing of the calculation logic independent of the UI.
