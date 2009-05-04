jsCheckFormRules=[
	{
		name: "firstname",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isText",
		validatedMsg: "Please provide a proper Firstname!"
	},
	{
		name: "lastname",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isText",
		validatedMsg: "Please provide a proper Lastname!"
	},		
	{
		name: "zip",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isGermanPLZ",
		validatedMsg: "Please provide a proper Post Code!"
	},		
	{
		name: "age",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isNumber",
		validatedMsg: "Please insert Numbers only!"
	},	
	{
		name: "city",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isText",
		validatedMsg: "Please provide a proper City!"
	},		
	{
		name: "email",
		type: "input",
		required: true,
		requiredMsg: "This Field is Mandatory!",
		validate: "isEmail",
		validatedMsg: "Invalid E-Mail Format"
	},		
	{
		name: "ip",
		type: "input",
		required: false,
		requiredMsg: "This Field is Optional!",
		validate: "isIpAdress",
		validatedMsg: "Invalid Format for a "
	},
	{
	    name: "ok",
	    type: "checkbox",
	    required: true,
	    requiredMsg: "This Field is Mandatory!"
	},
	{
		name: "want",
		type: "radio",
		required: true,
		requiredMsg: "Select one of the Options!"
	},
	{
		name: "really",
		type: "select",
		required: true,
		requiredMsg: "Select one of the Options!"
	}
];