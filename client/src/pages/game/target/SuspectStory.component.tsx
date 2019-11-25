import React from 'react';
import styles from './SuspectStory.module.css';

// @ts-ignore
const $ = window.$ as JQueryStatic;

interface Props {
	suspect: {
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
}

class SuspectStory extends React.Component<Props> {
	componentDidMount() {
		$('.ui.accordion').accordion();
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
						<th>{subtitle}</th>
						<td>{subContent}</td>
					</tr>
				);
			else {
				const result = Object.keys(subContent).map(key => {
					const value = subContent[key];
					return (
						<tr key={[title, subtitle, key].join('-')}>
							<th>{key}</th>
							<td>{value}</td>
						</tr>
					);
				});

				return (
					<React.Fragment key={[title, subtitle].join('-')}>
						<h3>{subtitle}</h3>
						<table>
							<tbody>{result}</tbody>
						</table>
					</React.Fragment>
				);
			}
		};

		const mapSuspects = (title: string) => {
			const content = props.suspect[title];
			if (typeof content === 'string') {
				return (
					<div className="ui basic segment" key={title}>
						<h1 className="ui header">{title}</h1>
						<p>{content}</p>
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
								{title}
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
								{title}
							</div>
							<div className="content">{result}</div>
						</React.Fragment>
					);
			}
		};

		let els = Object.keys(props.suspect).map(mapSuspects);
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
