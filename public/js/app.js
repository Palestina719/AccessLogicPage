
$(document).ready(function () {
	
	$(window).bind("load", function () {
		var footer = $("#footer");
		var pos = footer.position();
		var height = $(window).height();
		height = height - pos.top;
		height = height - footer.height();
		if (height > 0) {
			footer.css({
				'margin-top': height + 'px'
			});
		}
	});
	
    var popAdd = new Foundation.Reveal($('#mdelUser'));
});

function delUsr(evt) {
	var value = evt.target.getAttribute("value");
	var frm = document.getElementById("frmDel");
	frm.setAttribute("action", value);
}