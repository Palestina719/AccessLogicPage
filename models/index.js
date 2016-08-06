module.exports = function (mongoose){
	require("./entradas")(mongoose);
	require("./eventos")(mongoose);
	require("./logins")(mongoose);
	require("./salidas")(mongoose);
	require("./tarjetas")(mongoose);
	require("./templeado")(mongoose);
	require("./tincidencias")(mongoose);
	require("./empleado")(mongoose);
	require("./incidencias")(mongoose);
}
