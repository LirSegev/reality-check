import React from 'react';
import styles from './Legend.module.css';

const LegendView: React.FC = () => (
	<table id={styles.legend}>
		<tbody>
			<tr>
				<th>Mr. Z route</th>
				<th>
					<img src="/map_legend_icons/mr-z-route.png" alt="Mr Z icon" />
				</th>
			</tr>
			<tr>
				<th>Agent</th>
				<th>
					<img src="/map_legend_icons/player.png" alt="Player icon" />
				</th>
			</tr>
			<tr>
				<th>Intelligence point</th>
				<th>
					<img
						src="/map_legend_icons/intelligence-point.png"
						alt="Intelligence point icon"
					/>
				</th>
			</tr>
			<tr>
				<th>Detective point</th>
				<th>
					<img
						src="/map_legend_icons/detective-point.png"
						alt="Detective point icon"
					/>
				</th>
			</tr>
			<tr>
				<th>Chaser points</th>
				<th>
					<img
						src="/map_legend_icons/blending-zone.png"
						alt="Blending zone icon"
					/>
					<img src="/map_legend_icons/hiding-spot.png" alt="Hiding spot icon" />
					<img
						src="/map_legend_icons/interest-point.png"
						alt="Interest point icon"
					/>
					<img
						src="/map_legend_icons/special-station.png"
						alt="Public transport spot icon"
					/>
					<img src="/map_legend_icons/start-point.png" alt="Start point icon" />
				</th>
			</tr>
		</tbody>
	</table>
);

export default LegendView;
