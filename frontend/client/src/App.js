import {useState} from 'react';
import axios from 'axios';
import Spinner from './spinner';
import './app.css';
import { Form, Button, Col, Container } from 'react-bootstrap';

function App() {

	const [symbol, setSymbol] = useState('');
	const [date, setDate] = useState('');
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = e => {
		e.preventDefault();

		const data = { symbol, date };
		setLoading(true)
		axios.post("http://localhost:5000/api/fetchStockData/", data)
		.then(res => {
			setStats(res.data.data);
			setLoading(false);
		} )
		.catch(err => {
			console.error("Error fetching data: ", err);
			setLoading(false);
		});
	}

	return (
		<div>
			<h1 class="h1">Stock Trade Statistics</h1>
			<form onSubmit={handleSubmit}>
				<div class="row">
					<label class = "label">Stock Symbol:</label>
					<input type="text" id="symbol" value={symbol} onChange={sym => setSymbol(sym.target.value)} required/>
				</div>
				<br />
				<div class="row">
					<label class = "label">Date:</label>
					<input class="date" type="date" id="date" value={date} onChange={dt => setDate(dt.target.value)} required/>
				</div>
				<br/>
				<button class="btn btn-primary" type="submit">Get Statistics</button>
			</form>
			<spinner/>
			{loading && <Spinner/>}
			{stats && !loading && (
				<div id="stats">
					<h2>
						Trade Statistics for Symbol
					</h2>
					<ul>
						<li>Open: {stats.open}</li>
						<li>High: {stats.high}</li>
						<li>Low: {stats.low}</li>
						<li>Close: {stats.close}</li>
						<li>Volume: {stats.volume}</li>
					</ul>
				</div>
			)}
		</div>
	);
}

export default App;