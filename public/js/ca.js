	$(document).ready(function() {
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
			lang: 'es',
			
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: [
			{
				title: 'Revision de proyecto',
				start: '2016-08-01'
			}
			]
		});

		});
