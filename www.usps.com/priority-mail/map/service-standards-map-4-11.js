var USPS = {};

USPS.PMmap = (function() {
    
    var 
        elements = {};
    
    var init = function init() {

        elements.form = dojo.byId('mapform');
                
        dojo.connect(
            elements.form,
            'onsubmit',
            validateForm
        );
    };

    var validateForm = function validateForm(e) {
        if (typeof(event) === 'undefined') {
            e.preventDefault();
        } else{
            (event.preventDefault) ? e.preventDefault() : event.returnValue = false;
        }
        
        elements.origin = dojo.byId('originationzip');

        var numbersOnly      = /^[\d]*$/,
            originValue      = elements.origin.value,
            errors           = dojo.query('#errors ul')[0],
            inputSectionWrap = dojo.query('.delivery-map')[0],
            errorList        = [];
        
        dojo.removeClass(inputSectionWrap, 'error');
        dojo.empty(errors);


      if( originValue === '' || !numbersOnly.test(originValue) || (originValue.length < 5) ) {
		$('#error-search p').text('Please enter a valid 5-digit ZIP Code™.');
		$('#error-search').show();
		$('#originationzip').addClass('error');        
      } else {
            displaymap(dojo.byId('originationzip').value,dojo.byId('form-service').value);
            dojo.byId('originationzip').blur();
            dojo.byId("originationzip").scrollIntoView();
        }
        
    };
    
    return {
        start : init
    }
})();

dojo.addOnLoad(function() {
    USPS.PMmap.start();
});