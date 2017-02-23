$(document).ready(function() {
	var characters = [['Obi-Wan Kenobi', 'obi-wan', 'obiWan.jpg', 120, 8, 8],
					  ['Luke Skywalker', 'skywalker', 'lukeSkywalker.jpg', 100, 10, 5],
					  ['Darth Sidious', 'sidious', 'darthSidious.jpg', 150, 4, 20],
					  ['Darth Maul', 'maul', 'darthMaul.jpg', 180, 3, 25]];

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
					$(this).css("cursor", "default");
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
				$(this).css("cursor", "default");
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
			var attacker = $("#choose-character").children(".character");
			var defender = $("#fight").children(".character");
			updateCharacterHpDisplay();
			if (getCharacterHP(attacker) <= 0) {
				this.stageGameForRestart();
			} else if (getCharacterHP(defender) <= 0) {
				if (!$("#enemies-selection").children(".character").length) {
					this.stageGameForRestart();
				} else {
					this.stageGameForRematch();
				}
			} else {
				this.displayResultOfRound();
			}
		},

		stageGameForRestart: function() {
			var me = this;
			$("#fight-log-attacker").empty();
			var attackerHP = getCharacterHP($("#choose-character").children(".character"));
			if (attackerHP > 0) {
				$("#fight-log-response").text("You have won! Start Over?");
				$("#fight").children(".character").remove();
			} else {
				$("#fight-log-response").text("You have been defeated! Start Over?");
			}
			$("#attack-btn").off("click");
			var startOverBtn = $("<button></button>");
			startOverBtn.css("clear", "both");
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
				$(this).css("cursor", "pointer");
				$(this).on("click", function() {
					me.defenderSelected($(this).attr("id"));
				});
			});
		},

		displayResultOfRound: function() {
			var fightSection = $("#fight");
			var attacker = $("#choose-character").children(".character");
			var defender = $("#fight").children(".character");
			var fightLogAttacker = $("#fight-log-attacker");
			var fightLogResponse = $("#fight-log-response");
			fightLogAttacker.text("You attacked " + getCharacterName(defender) + 
									" for " + (getCharacterAttack(attacker) - 
									getCharacterAttackIncrement(attacker)) + " damage.");
			fightLogResponse.text(getCharacterName(defender) + " attacked you back for " + 
									getCharacterCounter(defender) + " damage.");
			fightSection.append(fightLogAttacker);
			fightSection.append(fightLogResponse);
		}
	};

	var clearCharacters = function() {
		$(".character").remove();
		$(".fight-log").empty();
		$("#start-over-btn").remove();
	};

	var setUpCharacters = function() {
		var chooseArea = $("#choose-character");
		function setBaseAttributes(characterAttributes, domCharacter) {
			chooseArea.append(domCharacter);
			domCharacter.attr("id", characterAttributes[1]);
			domCharacter.attr("verbose-name", characterAttributes[0]);
			domCharacter.addClass("character");
			domCharacter.attr("hp", characterAttributes[3]);
			domCharacter.attr("atk", characterAttributes[4]);
			domCharacter.attr("atkIncrement", characterAttributes[4]);
			newCharacter.attr("counter-atk", characterAttributes[5]);
		}
		function writeCharacterName(characterAttributes, domCharacter) {
			var charName = $("<p></p>");
			charName.addClass("character-descriptor");
			charName.text(characterAttributes[0]);
			domCharacter.append(charName);
		}
		function setCharacterImage(characterAttributes, domCharacter) {
			var charImageDiv = $("<div></div");
			charImageDiv.addClass("img-container");
			domCharacter.append(charImageDiv);
			var charImage = $("<img>");
			charImage.addClass("character-image");
			charImage.attr("src", "assets/images/" + characterAttributes[2]);
			charImageDiv.append(charImage);
		}
		function displayHealthCounter(characterAttributes, domCharacter) {
			var healthCounter = $("<p></p>");
			healthCounter.addClass("character-descriptor health-counter");
			healthCounter.text(characterAttributes[3] + "");
			domCharacter.append(healthCounter);
		}
		for (var i = 0; i < characters.length; i++) {
			var characterAttributes = characters[i];
			var newCharacter = $("<div></div>");
			setBaseAttributes(characterAttributes, newCharacter);
			writeCharacterName(characterAttributes, newCharacter);
			setCharacterImage(characterAttributes, newCharacter);
			displayHealthCounter(characterAttributes, newCharacter);
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
		if (newHP < 0) {
			jqueryRef.attr("hp", 0);
		} else {
			jqueryRef.attr("hp", newHP);
		}
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