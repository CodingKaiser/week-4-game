$(document).ready(function() {
	var characters = [['Obi-Wan Kenobi', 'obi-wan', 'obiWan.jpg', 120, 30, 40],
					  ['Luke Skywalker', 'skywalker', 'lukeSkywalker.jpg', 100, 40, 60],
					  ['Darth Sidious', 'sidious', 'darthSidious.jpg', 150, 50, 30],
					  ['Darth Maul', 'maul', 'darthMaul.jpg', 180, 20, 50]];

	var game = {
		characterChosen: false,
		currentlyFighting: false,
		start: function() {
			setUpCharacters();
			setCharacterSelectionListeners();
		},
	};

	var setUpCharacters = function() {
		for (var i = 0; i < characters.length; i++) {
			var currCharacter = characters[i];
			var chooseArea = $("#choose-character");
			var newCharacter = $("<div></div>");
			chooseArea.append(newCharacter);
			newCharacter.attr("id", currCharacter[1]);
			newCharacter.addClass("character");
			var charName = $("<p></p>");
			charName.addClass("character-descriptor");
			charName.text(currCharacter[0]);
			newCharacter.append(charName);
			var charImageDiv = $("<div></div");
			charImageDiv.addClass("img-container");
			newCharacter.append(charImageDiv);
			var charImage = $("<img>");
			charImage.addClass("character-image");
			charImage.attr("src", "assets/images/" + currCharacter[2]);
			charImageDiv.append(charImage);
			newCharacter.attr("hp", currCharacter[3]);
			newCharacter.attr("atk", currCharacter[4]);
			newCharacter.attr("counter-atk", currCharacter[5]);
			var healthCounter = $("<p></p>");
			healthCounter.addClass("character-descriptor");
			healthCounter.text(currCharacter[3] + "");
			newCharacter.append(healthCounter);
		};
	};

	var setCharacterSelectionListeners = function() {
		$("#choose-character").children(".character").each(function() {
			$(this).on("click", function() {
				console.log("this was clicked");
			});
		});
	};

	game.start();

	$("#choose-character").children('.character').each(function () {
		console.log($(this).attr("hp"));
	});

});