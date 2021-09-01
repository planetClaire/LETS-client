import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Members from './pages/Members';
import AuthorizeRoute from './components/auth/AuthorizeRoute';
import AuthorizeRoutes from './components/auth/AuthorizeRoutes';
import { AUTH_PREFIX } from './Constants';

import './index.css';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<AuthorizeRoute path="/members" component={Members} />
				<Route path={AUTH_PREFIX} component={AuthorizeRoutes} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
