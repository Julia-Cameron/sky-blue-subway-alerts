// TTC rapid transit lines and stations, in route order.
// Sources: Wikipedia "List of Toronto subway stations" and the Line 4, 5 and 6
// articles, checked Nov 2, 2026. Line 3 (Scarborough RT) closed in 2023.
// Recent renames: Dundas → TMU (Nov 2025), Eglinton West → Cedarvale (Dec 2025).
// An interchange (e.g. Bloor-Yonge) appears once on each line it serves.

module.exports = [
	{
		number: 1,
		name: 'Line 1',
		// Vaughan Metropolitan Centre → Union (University/Spadina) → Finch (Yonge)
		stations: [
			'Vaughan Metropolitan Centre',
			'Highway 407',
			'Pioneer Village',
			'York University',
			'Finch West',
			'Downsview Park',
			'Sheppard West',
			'Wilson',
			'Yorkdale',
			'Lawrence West',
			'Glencairn',
			'Cedarvale',
			'St. Clair West',
			'Dupont',
			'Spadina',
			'St. George',
			'Museum',
			"Queen's Park",
			'St. Patrick',
			'Osgoode',
			'St. Andrew',
			'Union',
			'King',
			'Queen',
			'TMU',
			'College',
			'Wellesley',
			'Bloor-Yonge',
			'Rosedale',
			'Summerhill',
			'St. Clair',
			'Davisville',
			'Eglinton',
			'Lawrence',
			'York Mills',
			'Sheppard-Yonge',
			'North York Centre',
			'Finch'
		]
	},
	{
		number: 2,
		name: 'Line 2',
		// Kipling → Kennedy
		stations: [
			'Kipling',
			'Islington',
			'Royal York',
			'Old Mill',
			'Jane',
			'Runnymede',
			'High Park',
			'Keele',
			'Dundas West',
			'Lansdowne',
			'Dufferin',
			'Ossington',
			'Christie',
			'Bathurst',
			'Spadina',
			'St. George',
			'Bay',
			'Bloor-Yonge',
			'Sherbourne',
			'Castle Frank',
			'Broadview',
			'Chester',
			'Pape',
			'Donlands',
			'Greenwood',
			'Coxwell',
			'Woodbine',
			'Main Street',
			'Victoria Park',
			'Warden',
			'Kennedy'
		]
	},
	{
		number: 4,
		name: 'Line 4',
		// Sheppard-Yonge → Don Mills
		stations: [
			'Sheppard-Yonge',
			'Bayview',
			'Bessarion',
			'Leslie',
			'Don Mills'
		]
	},
	{
		number: 5,
		name: 'Line 5',
		// Mount Dennis → Kennedy
		stations: [
			'Mount Dennis',
			'Keelesdale',
			'Caledonia',
			'Fairbank',
			'Oakwood',
			'Cedarvale',
			'Forest Hill',
			'Chaplin',
			'Avenue',
			'Eglinton',
			'Mount Pleasant',
			'Leaside',
			'Laird',
			'Sunnybrook Park',
			'Don Valley',
			'Aga Khan Park & Museum',
			'Wynford',
			'Sloane',
			"O'Connor",
			'Pharmacy',
			'Hakimi Lebovic',
			'Golden Mile',
			'Birchmount',
			'Ionview',
			'Kennedy'
		]
	},
	{
		number: 6,
		name: 'Line 6',
		// Finch West → Humber College
		stations: [
			'Finch West',
			'Sentinel',
			'Tobermory',
			'Driftwood',
			'Jane and Finch',
			'Norfinch Oakdale',
			'Signet Arrow',
			'Emery',
			'Milvan Rumike',
			'Duncanwoods',
			'Pearldale',
			'Rowntree Mills',
			'Mount Olive',
			'Stevenson',
			'Albion',
			'Martin Grove',
			'Westmore',
			'Humber College'
		]
	}
];
