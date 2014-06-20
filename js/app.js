requirejs.config({
    shim: {
        'underscore': {
            exports: '_'
        }
    }
});

// returns the log array
function cleanerEval(str) {
	var logArr = [];
	var log = function (str) {
		logArr.push(str);
	}
	eval(str);
	return logArr;
}

require(["sweet", "text!./macros.js", "text!./harness.js"], function(sweet, macroStr, harnessStr) {
	var editor, compiled;

	function updateExamples() {
		var exampleText = $(this).find("pre").text();
		editor.setValue(exampleText)
	}

	function updateCompiled() {
		$("#error-box").hide();
		$("#run-box").hide();
		try {
			var out = sweet.compile(macroStr + "\n" + editor.getValue(), {
				readableNames: true
			});
			out = harnessStr + "\n" + out.code;
			compiled.setValue(out);
			var logArr = cleanerEval(out);
			var logHtml = logArr.map(function(l) {
				return "<p>Log: " + l + "</p>";
			})
			$("#run-box").show().html("<h4 class='success-label'>Success</h4>"+ 
									  logHtml.join("\n"));

		} catch (e) {
			$("#error-box").show();
			$("#error-box").html("<pre>" + e + "</pre>");
		}
	}

	function init() {
		editor = CodeMirror.fromTextArea($("#editor")[0], {
			mode: "javascript",
			lineNumbers: true
		});

		compiled = CodeMirror.fromTextArea($("#compiled")[0], {
			mode: "javascript",
			lineNumbers: true,
			readOnly: true
		});

		$("#btn-examples li").click(updateExamples);
		$("#btn-run").click(updateCompiled)

		$("#btn-examples li:first").trigger("click");
	}


	$(document).ready(init);
});
