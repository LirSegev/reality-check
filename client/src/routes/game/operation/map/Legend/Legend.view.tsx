import React from 'react';
import styles from './Legend.module.css';

interface Props {
	closeLegend: () => void;
}

const LegendView: React.FC<Props> = props => (
	<table onClick={props.closeLegend}>
		<tbody>
			<tr>
				<td>Mr. Z route</td>
				<td>
					<img src="/map_legend_icons/mr-z-route.png" alt="Mr Z icon" />
				</td>
			</tr>
			<tr>
				<td>Agent</td>
				<td>
					<img src="/map_legend_icons/player.png" alt="Player icon" />
				</td>
			</tr>
			<tr>
				<td>Intelligence point</td>
				<td>
					<img
						src="/map_legend_icons/intelligence-point.png"
						alt="Intelligence point icon"
					/>
				</td>
			</tr>
			<tr>
				<td>Detective point</td>
				<td>
					<img
						src="/map_legend_icons/detective-point.png"
						alt="Detective point icon"
					/>
				</td>
			</tr>
			<tr>
				<th>Chaser points</th>
			</tr>
			<tr>
				<td className={styles.sub}>Starting point</td>
				<td>
					<img src="/map_legend_icons/start-point.png" alt="Start point icon" />
				</td>
			</tr>
			<tr>
				<td className={styles.sub}>Interest point</td>
				<td>
					<img
						src="/map_legend_icons/interest-point.png"
						alt="Interest point icon"
					/>
				</td>
			</tr>
			<tr>
				<td className={styles.sub}>Blending zone</td>
				<td>
					<img
						src="/map_legend_icons/blending-zone.png"
						alt="Blending zone icon"
					/>
				</td>
			</tr>
			<tr>
				<td className={styles.sub}>Hiding spot</td>
				<td>
					<img src="/map_legend_icons/hiding-spot.png" alt="Hiding spot icon" />
				</td>
			</tr>
			<tr>
				<td className={styles.sub}>Shortcut</td>
				<td>
					<img
						src="/map_legend_icons/special-station.png"
						alt="Public transport spot icon"
					/>
				</td>
			</tr>
		</tbody>
	</table>
);

export default LegendView;
