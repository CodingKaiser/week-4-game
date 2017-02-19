$(document).ready(function() {
	var characters = [['Obi-Wan Kenobi', 'obi-wan', 'obiWan.jpg', 120, 8, 40],
					  ['Luke Skywalker', 'skywalker', 'lukeSkywalker.jpg', 100, 40, 5],
					  ['Darth Sidious', 'sidious', 'darthSidious.jpg', 150, 50, 20],
					  ['Darth Maul', 'maul', 'darthMaul.jpg', 180, 5, 25]];

	var game = {
		characterChosen: false,
		currentlyFighting: false,

		start: function() {
			clearCharacters();
			setUpCharacters();
			setCharacterSelectionListeners();
		},

		characterSelected: function(characterID) {
			this.characterChosen = true;
			var chooseCharacter = $("#choose-character");
			var me = this;
			chooseCharacter.children(".character").each(function() {
				if (characterID === $(this).attr("id")) {
					$(this).off("click");
					chooseCharacter.append($("#choose-character-text"));
					chooseCharacter.append($(this));
				} else {
					var enemyArea = $("#enemies-selection");
					enemyArea.append($(this));
					$(this).addClass("character-enemy");
					$(this).off("click");
					$(this).on("click", function() {
						me.defenderSelected($(this).attr("id"));
					});
				}
			});
		},

		defenderSelected: function(characterID) {
			this.currentlyFighting = true;
			var enemySelectionArea = $("#enemies-selection");
			enemySelectionArea.children(".character").each(function () {
				if (characterID === $(this).attr("id")) {
					$("#fight").append($(this));
					$(this).addClass("character-defender character-descriptor-defender");
				}
				$(this).off("click");
			});
			this.startBattle();
		},

		startBattle: function() {
			var me = this;
			$(".fight-log").empty();
			$("#attack-btn").on("click", function() {
				var attacker = $("#choose-character").children(".character");
				var defender = $("#fight").children(".character");
				takeCharacterDamage(defender, getCharacterAttack(attacker));
				if (getCharacterHP(defender) > 0) {
					takeCharacterDamage(attacker, getCharacterCounter(defender));
				}
				increaseCharacterAttack(attacker);
				me.checkBattleStatusAndUpdate();
			});
		},

		checkBattleStatusAndUpdate: function() {
			var fightSection = $("#fight");
			var attacker = $("#choose-character").children(".character");
			var defender = $("#fight").children(".character");
			var attackerHP = getCharacterHP(attacker);
			var attackerAtk = getCharacterAttack(attacker);
			var attackerAtkIncrement = getCharacterAttackIncrement(attacker);
			var defenderHP = getCharacterHP(defender);
			var defenderName = getCharacterName(defender);
			var defenderCounter = getCharacterCounter(defender);
			var fightLogAttacker = $("#fight-log-attacker");
			var fightLogResponse = $("#fight-log-response");
			updateCharacterHpDisplay();
			if (getCharacterHP(attacker) <= 0) {
				this.stageGameForRestart();
			} else if (getCharacterHP(defender) <= 0) {
				this.stageGameForRematch();
			} else {
				fightLogAttacker.text("You attacked " + defenderName + " for " + (attackerAtk - attackerAtkIncrement) + " damage.");
				fightLogResponse.text(defenderName + " attacked you back for " + defenderCounter + " damage.");
				fightSection.append(fightLogAttacker);
				fightSection.append(fightLogResponse);
			}
		},

		stageGameForRestart: function() {
			var me = this;
			$("#fight-log-attacker").empty();
			$("#fight-log-response").text("You have been defeated! Start Over?");
			$("#attack-btn").off("click");
			var startOverBtn = $("<button></button>");
			startOverBtn.attr("id", "start-over-btn");
			startOverBtn.text("Start Over");
			startOverBtn.on("click", function() {
				me.start();
			});
			$("#fight").append(startOverBtn);
		},

		stageGameForRematch: function() {
			var me = this;
			var defender = $("#fight").children(".character");
			var defenderName = getCharacterName(defender);
			$("#fight-log-attacker").empty();
			$("#fight-log-response").text("You have defeated " + defenderName + ". You can choose to fight another enemy.");
			$("#attack-btn").off("click");
			defender.remove();
			$("#enemies-selection").children(".character").each(function() {
				$(this).on("click", function() {
					me.defenderSelected($(this).attr("id"));
				});
			});
		},
	};

	var clearCharacters = function() {
		$(".character").remove();
		$(".fight-log").empty();
		$("#start-over-btn").remove();
	};

	var setUpCharacters = function() {
		var chooseArea = $("#choose-character");
		for (var i = 0; i < characters.length; i++) {
			var currCharacter = characters[i];
			var newCharacter = $("<div></div>");
			chooseArea.append(newCharacter);
			newCharacter.attr("id", currCharacter[1]);
			newCharacter.attr("verbose-name", currCharacter[0]);
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
			newCharacter.attr("atkIncrement", currCharacter[4]);
			newCharacter.attr("counter-atk", currCharacter[5]);
			var healthCounter = $("<p></p>");
			healthCounter.addClass("character-descriptor health-counter");
			healthCounter.text(currCharacter[3] + "");
			newCharacter.append(healthCounter);
		};
		chooseArea.append($("#choose-character-text"));
	};

	var setCharacterSelectionListeners = function() {
		$("#choose-character").children(".character").each(function() {
			$(this).on("click", function() {
				game.characterSelected($(this).attr("id"));
			});
		});
	};

	var getCharacterName = function(jqueryRef) {
		return jqueryRef.attr("verbose-name");
	}

	var getCharacterHP = function(jqueryRef) {
		return parseInt(jqueryRef.attr("hp"));
	};

	var getCharacterCounter = function(jqueryRef) {
		return parseInt(jqueryRef.attr("counter-atk"));
	};

	var getCharacterAttack = function(jqueryRef) {
		return parseInt(jqueryRef.attr("atk"));
	};

	var getCharacterAttackIncrement = function(jqueryRef) {
		return parseInt(jqueryRef.attr("atkIncrement"));
	};

	var takeCharacterDamage = function(jqueryRef, damage) {
		var characterHP = getCharacterHP(jqueryRef);
		var newHP = characterHP - parseInt(damage);
		jqueryRef.attr("hp", newHP);
	};

	var increaseCharacterAttack = function(jqueryRef) {
		var currentAttack = getCharacterAttack(jqueryRef);
		var attackIncrement = getCharacterAttackIncrement(jqueryRef);
		var newAttack = currentAttack + attackIncrement;
		jqueryRef.attr("atk", newAttack);
	}

	var updateCharacterHpDisplay = function() {
		$(".character").each(function() {
			$(this).children(".health-counter").text($(this).attr("hp"));
		});
	}

	game.start();
});