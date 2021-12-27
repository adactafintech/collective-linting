import { Route, Switch } from 'react-router';
import './App.css';
import CategoryBrowser from './ItemList/CategoryBrowser'
import ItemView from './ItemList/ItemView'
import { 
  BrowserRouter as Router,
} from "react-router-dom";

function App() {
  return (
    <div className="App justify-content-center">
      <Router>
        <Switch>
          <Route path="/category/:id" render={(props) => <ItemView id={props.match.params.id} /> } />
          <Route path="/category/" render={(props) => <ItemView id={null} /> } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;