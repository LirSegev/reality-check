import React from 'react';

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

const SuspectStory: React.FC<Props> = props => {
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
					<td>{subtitle}</td>
					<td>{subContent}</td>
				</tr>
			);
		else {
			const result = Object.keys(subContent).map(key => {
				const value = subContent[key];
				return (
					<tr key={[title, subtitle, key].join('-')}>
						<td>{key}</td>
						<td>{value}</td>
					</tr>
				);
			});

			return (
				<React.Fragment key={[title, subtitle].join('-')}>
					<h1>{subtitle}</h1>
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
				<div key={title}>
					<h1>{title}</h1>
					<p>{content}</p>
				</div>
			);
		} else {
			const result = Object.keys(content).map(mapTableOrTables(content, title));

			if (result[0].type === 'tr')
				return (
					<React.Fragment key={title}>
						<h1>{title}</h1>
						<table>
							<tbody>{result}</tbody>
						</table>
					</React.Fragment>
				);
			else
				return (
					<React.Fragment key={title}>
						<h1>{title}</h1>
						{result}
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
				newEls.push(<div key={`multipleTables-${lastEl.key}`}>{tables}</div>);
				tables = [];
			}
			newEls.push(el);
		} else {
			tables.push(el);
		}

		lastEl = el;
	});
	if (tables)
		newEls.push(<div key={`multipleTables-${lastEl.key}`}>{tables}</div>);
	els = newEls;

	return <React.Fragment>{els}</React.Fragment>;
};

export default SuspectStory;
