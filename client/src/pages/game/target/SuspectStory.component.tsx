import React from 'react';
import styles from './SuspectStory.module.css';

// @ts-ignore
const $ = window.$ as JQueryStatic;

interface Props {
	suspect: {
		name: string;
		id: number;
		data: {
			[title: string]:
				| string
				| {
						[subtitle: string]:
							| string
							| {
									[key: string]: string;
							  };
				  };
		};
	};
}

class SuspectStory extends React.Component<Props> {
	componentDidMount() {
		$('.ui.accordion').accordion();
	}

	_formatTitle(s: string) {
		let result = s.replace(/[_-]/g, ' ');
		return result;
	}

	render() {
		const props = this.props;
		const mapTableOrTables = (
			content: {
				[subtitle: string]:
					| string
					| {
							[key: string]: string;
					  };
			},
			title: string
		) => (subtitle: string) => {
			const subContent = content[subtitle];
			if (typeof subContent === 'string')
				return (
					<tr key={[title, subtitle].join('-')}>
						<th>{this._formatTitle(subtitle)}</th>
						<td>{subContent}</td>
					</tr>
				);
			else {
				const result = Object.keys(subContent).map(key => {
					const value = subContent[key];
					return (
						<tr key={[title, subtitle, key].join('-')}>
							<th>{this._formatTitle(key)}</th>
							<td>{value}</td>
						</tr>
					);
				});

				return (
					<React.Fragment key={[title, subtitle].join('-')}>
						<h3>{this._formatTitle(subtitle)}</h3>
						<table>
							<tbody>{result}</tbody>
						</table>
					</React.Fragment>
				);
			}
		};

		const mapSuspects = (suspect: Props['suspect']) => (title: string) => {
			const content = suspect.data[title];
			if (typeof content === 'string') {
				const pEls = content
					.split('\n\n')
					.map((s, i) => <p key={[title, 'paragraph', i].join('-')}>{s}</p>);
				return (
					<div className="ui basic segment" key={title}>
						<h1 className="ui header">{this._formatTitle(title)}</h1>
						{pEls}
					</div>
				);
			} else {
				const result = Object.keys(content).map(
					mapTableOrTables(content, title)
				);

				if (result[0].type === 'tr')
					return (
						<React.Fragment key={title}>
							<div className="title">
								<i className="dropdown icon" />
								{this._formatTitle(title)}
							</div>
							<div className="content">
								<table>
									<tbody>{result}</tbody>
								</table>
							</div>
						</React.Fragment>
					);
				else
					return (
						<React.Fragment key={title}>
							<div className="title">
								<i className="dropdown icon" />
								{this._formatTitle(title)}
							</div>
							<div className="content">{result}</div>
						</React.Fragment>
					);
			}
		};

		let els = Object.keys(props.suspect.data).map(mapSuspects(props.suspect));
		const newEls: JSX.Element[] = [];
		let tables: JSX.Element[] = [];
		let lastEl: JSX.Element = <div />;
		els.forEach(el => {
			if (el.type === 'div') {
				if (lastEl.type !== 'div') {
					newEls.push(
						<div
							className="ui fluid accordion"
							key={`multipleTables-${lastEl.key}`}
						>
							{tables}
						</div>
					);
					tables = [];
				}
				newEls.push(el);
			} else {
				tables.push(el);
			}

			lastEl = el;
		});
		if (tables)
			newEls.push(
				<div
					className="ui fluid accordion"
					key={`multipleTables-${lastEl.key}`}
				>
					{tables}
				</div>
			);
		els = newEls;

		return <div className={styles.suspectStory}>{els}</div>;
	}
}

export default SuspectStory;
