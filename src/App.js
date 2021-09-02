import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import Members from './pages/Members';
import AuthorizeRoute from './components/auth/AuthorizeRoute';
import AuthorizeRoutes from './components/auth/AuthorizeRoutes';
import { AUTH_PREFIX } from './Constants';
import MainMenu from './components/navigation/MainMenu';

import './index.css';

function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen">
				<MainMenu />
				<Route exact path="/" component={Home} />
				<AuthorizeRoute path="/members" component={Members} />
				<Route path={AUTH_PREFIX} component={AuthorizeRoutes} />
			</div>
		</BrowserRouter>
	);
}

export default App;
