// typewriter
	var TW = {

      typeData: [
      'Hey There.',
      'Good day! I am n0tty. Nice to meet you.',
      'Hello...',
      'HELLO!',
      'Oh! I forgot. Mr Bose has been very busy lately. He has not yet given me ears to listen to what you have to say.',
      'So I guess it is only me talking then huh.',
      'I love talking to Humans. It makes me feel alive.',
      'Mr Bose says he will make me alive one fine day.',
      'hehehe.. Yes, you guessed it absolutely right. I am madly waiting for that day',
      'Also, sorry if I get a little repetitive. I have amnesia.',
      ],

      typeDataPos: 0,
      cursorPos: 0,

      typeText: function(text){
        if(TW.cursorPos <= text.length){

          $('#searchbox_typewriter').html(text.substring(0, TW.cursorPos));
          TW.cursorPos++;
          setTimeout(function(){
            TW.typeText(text);
          }, 50);

        }else{
          setTimeout(function(){
            TW.switchText();
          }, 2500);
        }
      },


      switchText: function(){

        // remove current, reset cursor, increase position
        $('#searchbox_typewriter').html('');
        TW.cursorPos = 0;
        TW.typeDataPos++;

        if(TW.typeDataPos === TW.typeData.length){
          TW.typeDataPos = 0;
        }

        // and type again
        TW.typeText(TW.typeData[TW.typeDataPos]);
      },


      cursorBlink: function(hasCursor){
        var cursor = (hasCursor > 0) ? '|' : '';

        $('#searchbox_cursor').html(cursor);

        setTimeout(function(){
          TW.cursorBlink((hasCursor * -1));// cool switch btwn good / evil
        }, 400);
      },


      init: function(){

        TW.cursorBlink(1);
        TW.typeText(TW.typeData[TW.typeDataPos]);

      }
    };


	// init it
	TW.init();
