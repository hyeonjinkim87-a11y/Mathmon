function testGen1PokemonData() {
			const speciesIds = gen1PokemonData.map((pokemon) => pokemon.speciesId);
			const dexNumbers = gen1PokemonData.map((pokemon) => pokemon.dexNumber);
			const invalidEvolutionRefs = Object.entries(gen1EvolutionData).flatMap(([speciesId, nextIds]) => nextIds.filter((nextId) => !gen1PokemonById[nextId]).map((nextId) => `${speciesId}->${nextId}`));
			const existingIds = ['charmander', 'charmeleon', 'charizard', 'bulbasaur', 'ivysaur', 'venusaur', 'squirtle', 'wartortle', 'blastoise', 'pikachu', 'raichu', 'pidgey', 'rattata', 'dratini', 'snorlax', 'articuno', 'mew'];
			const result = { total: gen1PokemonData.length, dexNumberValid: dexNumbers.length === 151 && new Set(dexNumbers).size === 151 && dexNumbers.every((number, index) => number === index + 1), duplicateSpecies: speciesIds.filter((speciesId, index) => speciesIds.indexOf(speciesId) !== index), missingFields: gen1PokemonData.filter((pokemon) => !pokemon.name || !pokemon.type || !pokemon.rarity).map((pokemon) => pokemon.speciesId), invalidEvolutionRefs, imagePathErrors: gen1PokemonData.filter((pokemon) => !getPokemonImagePath(pokemon.speciesId) || getPokemonImagePath(pokemon.speciesId) !== `assets/pokemon/${String(pokemon.dexNumber).padStart(3, '0')}-${pokemon.speciesId}.png`).map((pokemon) => pokemon.speciesId), existingPokemonPreserved: existingIds.every((speciesId) => getPokemonSpeciesData(speciesId)), starterPokemonValid: ['bulbasaur', 'charmander', 'squirtle'].every((speciesId) => starterPokemonIds.includes(speciesId)) };
			result.pass = result.total === 151 && result.dexNumberValid && result.duplicateSpecies.length === 0 && result.missingFields.length === 0 && result.invalidEvolutionRefs.length === 0 && result.imagePathErrors.length === 0 && result.existingPokemonPreserved && result.starterPokemonValid;
			console.log('testGen1PokemonData:', result.pass ? 'PASS' : 'FAIL', result);
			return result;
		}
		function getPokemonSpeciesData(speciesId) {
			return starterPokemonData[speciesId] || wildPokemonData.find((pokemon) => pokemon.speciesId === speciesId) || gen1PokemonById[speciesId] || null;
		}

		function getPokemonImagePath(speciesId) {
			return pokemonImageData[speciesId]?.image || null;
		}

		function renderPokemonImage(speciesId, options = {}) {
			const species = getPokemonSpeciesData(speciesId);
			const imagePath = pokemonImageData[speciesId]?.image || null;
			const fallback = species?.emoji || '🐾';
			const className = options.className || '';
			const alt = options.alt || species?.name || '포켓몬';
			const sizeStyle = options.size ? ` style="width:${options.size};height:${options.size}"` : '';
			const silhouetteClass = options.silhouette ? ' silhouette-pokemon' : '';
			if (!imagePath) return `<span class="pokemon-image ${className}${silhouetteClass}"${sizeStyle} role="img" aria-label="${alt}"><span class="pokemon-image-fallback">${fallback}</span></span>`;
			return `<span class="pokemon-image ${className}${silhouetteClass}"${sizeStyle} role="img" aria-label="${alt}"><img src="${imagePath}" alt="${alt}"><span class="pokemon-image-fallback">${fallback}</span></span>`;
		}

		function getNextEvolutionInfo(speciesId) {
			const evolution = evolutionData[speciesId];
			if (!evolution || !evolution.next) return null;
			return evolution;
		}

		function updateNextEvolutionDisplay() {
			const activePokemon = getActivePokemon();
			if (!activePokemon) {
				document.querySelector('#nextEvolutionCard').hidden = true;
				return;
			}
			const evolutionInfo = getNextEvolutionInfo(activePokemon.speciesId);
			if (!evolutionInfo) {
				document.querySelector('#nextEvolutionCard').hidden = true;
				return;
			}
			const nextSpecies = getPokemonSpeciesData(evolutionInfo.next);
			if (!nextSpecies) {
				document.querySelector('#nextEvolutionCard').hidden = true;
				return;
			}
			const isEvolutionReady = evolutionInfo.evolutionMethod === 'level' && activePokemon.level >= evolutionInfo.evolutionLevel;
			const nextEvolutionCard = document.querySelector('#nextEvolutionCard');
			const imageContainer = document.querySelector('#nextEvolutionImageContainer');
			const nameElement = document.querySelector('#nextEvolutionName');
			const levelElement = document.querySelector('#nextEvolutionLevel');
			imageContainer.innerHTML = renderPokemonImage(evolutionInfo.next, { 
				alt: nextSpecies.name, 
				silhouette: !isEvolutionReady 
			});
			bindPokemonImageFallback(imageContainer);
			nameElement.textContent = nextSpecies.name;
			if (evolutionInfo.evolutionMethod === 'level') {
				levelElement.textContent = isEvolutionReady ? '진화 가능!' : `Lv.${evolutionInfo.evolutionLevel} 진화`;
				levelElement.style.color = isEvolutionReady ? 'var(--green)' : 'var(--orange)';
			} else if (evolutionInfo.evolutionMethod === 'stone') {
				levelElement.textContent = '돌 필요';
			} else if (evolutionInfo.evolutionMethod === 'trade') {
				levelElement.textContent = '거래 필요';
			} else if (evolutionInfo.evolutionMethod === 'friendship') {
				levelElement.textContent = '우정 필요';
			}
			nextEvolutionCard.hidden = false;
		}

		function renderDexImage(speciesId, discovered) {
			const species = getPokemonSpeciesData(speciesId);
			return discovered ? renderPokemonImage(speciesId, { className: 'dex-emoji', alt: species?.name }) : `<span class="dex-emoji">${species?.emoji || '🐾'}</span>`;
		}

		function bindPokemonImageFallback(container) {
			container.querySelectorAll('.pokemon-image img').forEach((image) => {
				image.addEventListener('load', () => {
					image.parentElement.classList.add('is-loaded');
					image.nextElementSibling.hidden = true;
				});
				image.addEventListener('error', () => image.remove(), { once: true });
			});
		}

		function testPokemonImageSystem() {
			const starterIds = ['charmander', 'bulbasaur', 'squirtle', 'pikachu'];
			const wildIds = wildPokemonData.map((pokemon) => pokemon.speciesId);
			const evolutionIds = ['charmander', 'charmeleon', 'charizard'];
			const allIds = [...new Set([...starterIds, 'charmeleon', 'charizard', 'ivysaur', 'venusaur', 'wartortle', 'blastoise', 'raichu', ...wildIds])];
			const existingImageIds = ['charmander', 'charmeleon', 'charizard', 'bulbasaur', 'ivysaur', 'venusaur', 'squirtle', 'wartortle', 'blastoise', 'pikachu', 'raichu', 'pidgey', 'rattata', 'dratini', 'snorlax', 'articuno', 'mew'];
			const missing = renderPokemonImage('unknown');
			const results = {
				charmanderPath: getPokemonImagePath('charmander') === 'assets/pokemon/004-charmander.png',
				pikachuPath: getPokemonImagePath('pikachu') === 'assets/pokemon/025-pikachu.png',
				unknownPath: getPokemonImagePath('unknown') === null,
				missingDataFallback: !missing.includes('<img'),
				starterPokemon: starterIds.every((speciesId) => getPokemonImagePath(speciesId)),
				wildPokemon: wildIds.every((speciesId) => getPokemonImagePath(speciesId)),
				evolutionPokemon: evolutionIds.every((speciesId) => getPokemonImagePath(speciesId)),
				allPokemonMapped: allIds.length === 151 && allIds.every((speciesId) => getPokemonImagePath(speciesId)),
				existingImagesMapped: existingImageIds.every((speciesId) => getPokemonImagePath(speciesId) === pokemonImageData[speciesId]?.image),
				undiscoveredNoImage: !renderDexImage('snorlax', false).includes('<img') && !renderDexImage('unknown', false).includes('<img'),
				activePokemonUnchanged: currentPlayer ? Boolean(currentPlayer.activePokemonId) : true
			};
			Object.entries(results).forEach(([name, passed]) => console.log(`testPokemonImageSystem ${name}: ${passed ? 'PASS' : 'FAIL'}`));
			return results;
		}

		function testEvolutionSystem() {
			const results = {
				hasEvolutionData: Object.keys(evolutionData).length === 151,
				dataStructure: true,
				levelEvolutions: [],
				stoneEvolutions: [],
				tradeEvolutions: [],
				noEvolutions: [],
				chainEvolutions: [],
				allPokemonInData: true
			};
			
			gen1PokemonData.forEach((pokemon) => {
				const evolutionInfo = evolutionData[pokemon.speciesId];
				if (!evolutionInfo) {
					results.allPokemonInData = false;
					return;
				}
				if (evolutionInfo.next && evolutionInfo.evolutionMethod === 'level') {
					results.levelEvolutions.push({ from: pokemon.speciesId, to: evolutionInfo.next, level: evolutionInfo.evolutionLevel });
				} else if (evolutionInfo.next && evolutionInfo.evolutionMethod === 'stone') {
					results.stoneEvolutions.push({ from: pokemon.speciesId, to: evolutionInfo.next });
				} else if (evolutionInfo.next && evolutionInfo.evolutionMethod === 'trade') {
					results.tradeEvolutions.push({ from: pokemon.speciesId, to: evolutionInfo.next });
				} else if (!evolutionInfo.next) {
					results.noEvolutions.push(pokemon.speciesId);
				}
			});
			
			const chainEvos = [
				['bulbasaur', 'ivysaur', 'venusaur'],
				['charmander', 'charmeleon', 'charizard'],
				['squirtle', 'wartortle', 'blastoise'],
				['caterpie', 'metapod', 'butterfree'],
				['weedle', 'kakuna', 'beedrill'],
				['pidgey', 'pidgeotto', 'pidgeot'],
				['dratini', 'dragonair', 'dragonite']
			];
			
			chainEvos.forEach((chain) => {
				let isValid = true;
				for (let i = 0; i < chain.length - 1; i++) {
					const evo = evolutionData[chain[i]];
					if (!evo || evo.next !== chain[i + 1]) {
						isValid = false;
						break;
					}
				}
				if (isValid) {
					results.chainEvolutions.push(chain.join(' -> '));
				}
			});
			
			const testCases = [
				{ speciesId: 'bulbasaur', level: 15, shouldEvolve: false },
				{ speciesId: 'bulbasaur', level: 16, shouldEvolve: true },
				{ speciesId: 'charmander', level: 15, shouldEvolve: false },
				{ speciesId: 'charmander', level: 16, shouldEvolve: true },
				{ speciesId: 'dratini', level: 29, shouldEvolve: false },
				{ speciesId: 'dratini', level: 30, shouldEvolve: true },
				{ speciesId: 'dragonair', level: 54, shouldEvolve: false },
				{ speciesId: 'dragonair', level: 55, shouldEvolve: true }
			];
			
			const evolutionChecks = testCases.map((testCase) => {
				const evo = evolutionData[testCase.speciesId];
				if (!evo || !evo.next) return testCase.shouldEvolve === false;
				const canEvolve = evo.evolutionMethod === 'level' && testCase.level >= evo.evolutionLevel;
				return canEvolve === testCase.shouldEvolve;
			});
			
			console.log('testEvolutionSystem results:');
			console.log(`  All 151 pokemon have evolution data: ${results.hasEvolutionData}`);
			console.log(`  Level-based evolutions: ${results.levelEvolutions.length}`);
			console.log(`  Stone-based evolutions: ${results.stoneEvolutions.length}`);
			console.log(`  Trade-based evolutions: ${results.tradeEvolutions.length}`);
			console.log(`  No evolution: ${results.noEvolutions.length}`);
			console.log(`  Valid evolution chains: ${results.chainEvolutions.length}`);
			console.log(`  Evolution level checks: ${evolutionChecks.every(Boolean) ? 'PASS' : 'FAIL'}`);
			console.log(`  All pokemon have evolution data: ${results.allPokemonInData ? 'PASS' : 'FAIL'}`);
			
			return {
				pass: results.hasEvolutionData && results.allPokemonInData && evolutionChecks.every(Boolean),
				details: results
			};
		}

		const maxLevelMessages = ['{name}! 드디어 Lv.100이야! 👑', '최고 레벨 달성! 정말 대단해!', '{name}는 진정한 포켓몬 트레이너가 되었어!'];
		const starterMessages = ['{name}! {pokemonName}와 함께 모험을 시작해보자!', '{pokemonName}가 {name}를 기다리고 있었어!', '{name}과(와) {pokemonName}의 멋진 모험이 시작됐어!'];
		const encounterSettings = { 5: 0.10, 10: 0.12, 20: 0.14, 35: 0.16, 50: 0.18, 80: 0.20 };
		const MIN_QUESTIONS_BETWEEN_ENCOUNTERS = 8;
		const streakMilestones = {
			3: { stars: 4, reactionClass: 'streak-3', bonusXP: 5 },
			5: { stars: 6, reactionClass: 'streak-5', bonusXP: 10 },
			10: { stars: 6, reactionClass: 'is-special', bonusXP: 20 },
			20: { stars: 6, reactionClass: 'is-special', bonusXP: 30 },
			30: { stars: 6, reactionClass: 'is-special', bonusXP: 50 },
			50: { stars: 6, reactionClass: 'is-special', bonusXP: 100 }
		};
		const gameStartMessages = ['{name}! 오늘도 멋진 모험을 시작해볼까? 🐾', '{name}, 기다리고 있었어!', '{name}! 오늘은 어떤 포켓몬을 만날까?', '{name}가 왔다! 오늘도 힘내자!', '{name}! 수학 모험 출발! 🚀', '오늘도 재미있는 모험이 기다리고 있어!', '{name}, 준비됐어?', '자, 오늘의 모험을 시작해보자!', '포켓몬 친구들이 {name}를 기다리고 있어!', '{name}! 오늘은 얼마나 멀리 갈 수 있을까?', '새로운 포켓몬을 만날 준비됐어?', '{name}라면 오늘도 잘할 수 있어!', '오늘도 멋지게 도전해보자!', '{name}, 우리 함께 출발하자!', '수학 모험 시작! 가보자! 🚀'];
		const correctMessages = ['{name}, 정답이야! 🎉', '대단해, {name}!', '{name} 최고! 👍', '와! {name}가 맞혔어!', '정답! 계속 가보자!', '멋진데? {name}! ⭐', '잘했어! 계속 도전해보자!', '정확해! 👍', '완벽해!', '아주 잘했어!', '훌륭해!', '바로 그거야!', '한 번에 맞혔네!', '멋지게 풀었어!', '정답을 찾아냈어!', '포켓몬도 깜짝 놀랐어!', '오! 정확했어!', '정말 빠르게 풀었어!', '집중력이 대단한걸?', '이번에도 성공!', '또 맞혔어!', '아주 좋은 풀이야!', '실력이 점점 좋아지고 있어!', '멋진 정답이야!', '잘하고 있어!', '좋아! 다음 문제로 가보자!', '정답 행진을 이어가자!', '포켓몬에게 힘을 보내고 있어!', '오늘 실력이 좋은데?', '점점 더 강해지고 있어!'];
		const wrongMessages = ['괜찮아, {name}! 다시 생각해보자! 💪', '조금만 더 생각해볼까?', '{name}라면 할 수 있어!', '아깝다! 한 번 더 도전!', '천천히 생각해도 괜찮아.', '포켓몬도 응원하고 있어!', '괜찮아! 틀릴 수도 있어!', '다시 도전해보자!', '힌트를 찾아보자! 🔎', '서두르지 않아도 돼.', '다음에는 맞힐 수 있어!', '한 번 더 해보자!', '괜찮아! 포기하지 말자!', '실수하면서 더 잘하게 되는 거야!', '다시 계산해볼까?', '이번에는 천천히 해보자.', '거의 맞았어!', '다시 한번 도전!', '정답을 찾아보자!', '괜찮아, 다시 해보면 돼!', '우리 포켓몬도 기다리고 있어!', '천천히 하면 할 수 있어!', '다시 한번 생각해보자!', '이번 문제는 조금 어려웠나 봐!'];
		const streakMessages = ['계속 잘하고 있어!', '연속으로 맞히고 있는데?', '집중력이 최고야!', '포켓몬이 점점 신나고 있어!', '이대로 가보자!', '멋진 흐름이야!', '지금 아주 잘하고 있어!', '연속 정답 행진이다!', '오늘 실력이 정말 좋은걸?', '점점 더 강해지고 있어!', '포켓몬에게 힘을 보내주고 있어!', '멋지게 이어가고 있어!', '다음 문제도 도전!', '지금 페이스 아주 좋아!', '포켓몬과 함께 힘내보자!'];
		const speedMessages = ['우와! 정말 빨랐어! ⚡', '번개처럼 풀었어!', '엄청 빠른데?', '순식간에 풀었어!', '포켓몬보다 빠르다!', '빠르고 정확해!', '와, 눈 깜짝할 사이에 맞혔어!', '엄청난 속도야! ⚡'];
		const recoveryMessages = ['그래! 바로 다시 해냈어! 💪', '좋아! 다시 바로 성공했어!', '멋져! 포기하지 않았어!', '틀려도 다시 도전하면 돼!', '바로 다시 맞혔네!', '끝까지 도전한 게 멋져!', '다시 도전해서 성공했어!'];
		const levelUpMessages = ['{name}! 레벨 업이다! 🎉', '축하해, {name}! 한 단계 더 강해졌어!', '{name}, 새로운 레벨에 도착했어!', '레벨 업! 포켓몬도 기뻐하고 있어!', '대단해! {name}의 실력이 올라갔어!', '새로운 레벨을 달성했어! ⭐', '{name}! 점점 강한 트레이너가 되고 있어!', '레벨 업 성공! 계속 모험하자!'];
		const pokemonDiscoveryMessages = ['{name}! 포켓몬을 발견했어! 😮', '잠깐! 저기 뭔가 있어!', '{name}, 새로운 포켓몬이 나타났어!', '우와! 야생 포켓몬이다!', '저 실루엣은 대체 누구일까?', '포켓몬을 발견했다! 조심스럽게 다가가자!', '새로운 포켓몬이 우리 앞에 나타났어!', '{name}! 포켓몬을 잡을 기회야!'];
		const captureMessages = ['{name}! 포켓몬을 잡았어! 🎉', '새로운 친구가 생겼다!', '대단해, {name}! 포획 성공!', '포켓몬이 우리 친구가 되었어!', '멋져! 새로운 포켓몬을 얻었어!', '도감에 새로운 포켓몬이 추가됐어!', '{name}, 정말 멋진 포획이야!', '새로운 포켓몬 친구를 만났어! ⭐'];
		const milestoneMessages = { 3: '3연속 정답! 🎉', 5: '5연속 정답! 🔥', 10: '10연속 정답! ⭐', 20: '20연속 정답! 🌟', 30: '30연속 정답! 💥', 50: '50연속 정답! 👑' };
		const messageCategories = { start: gameStartMessages, correct: correctMessages, wrong: wrongMessages, streak: streakMessages, speed: speedMessages, recovery: recoveryMessages, levelUp: levelUpMessages, maxLevel: maxLevelMessages, discovery: pokemonDiscoveryMessages, capture: captureMessages };
		const FAST_ANSWER_TIME = 3000;
		const backgroundOptions = [
			{ id: 'bg-main', name: '숲', path: 'assets/background/background-main.png' },
			{ id: 'bg-sea', name: '바다', path: 'assets/background/background-sea.png' }
		];
		const trainerOptions = [
			{ id: 'trainer-1', name: '지우', image: 'assets/trainers/trainer-1.png' },
			{ id: 'trainer-2', name: '레드', image: 'assets/trainers/trainer-2.png' },
			{ id: 'trainer-3', name: '이슬이', image: 'assets/trainers/trainer-3.png' }
		];
		const lastMessages = {};
		let currentPlayer = loadGameData();
		let pokemonDex = loadPokemonDex();
		let streakCount = 0;
		let reactionTimer;
		let messageTimer;
		let questionStartedAt = Date.now();
		let previousAnswerWasWrong = false;
		let selectedStarterPokemon = null;
		let isEncounterActive = false;
		let currentEncounter = null;
		let captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
		let currentQuestion = null;
		let selectedDifficulties = ['twoDigitAddition'];
		let currentDifficulty = currentPlayer?.difficulty || 'twoDigitAddition';
		let buddyMovementFrame = null;
		let buddyMovementState = { x: 0, targetX: 0, direction: 1, nextDirection: 1, phase: 'IDLE', phaseStartedAt: 0, idleDuration: 0, segmentStartedAt: 0, segmentDuration: 0, fromX: 0 };

		function getBuddyMovementLimit() {
			const habitat = document.querySelector('.habitat');
			return habitat ? Math.max(0, Math.min(128, (habitat.clientWidth - buddy.offsetWidth) / 2 - 16)) : 0;
		}

		function setBuddyDirection(direction) {
			buddyMovementState.direction = direction;
			buddyImage.style.transform = `scaleX(${direction > 0 ? -1 : 1})`;
		}

		function setBuddyMovementPhase(phase) {
			buddyMovementState.phase = phase;
			buddy.classList.remove('is-idle', 'is-walking', 'is-turn');
			buddy.classList.add({ IDLE: 'is-idle', WALKING: 'is-walking', TURN: 'is-turn' }[phase]);
		}

		function startBuddyIdle(timestamp) {
			setBuddyMovementPhase('IDLE');
			buddyMovementState.phaseStartedAt = timestamp;
			buddyMovementState.idleDuration = 700 + Math.random() * 900;
		}

		function chooseBuddyDestination(timestamp) {
			const limit = getBuddyMovementLimit();
			const minimumDistance = Math.min(48, limit * 0.6);
			let targetX = buddyMovementState.x;
			let attempts = 0;
			while (Math.abs(targetX - buddyMovementState.x) < minimumDistance && attempts < 8) {
				targetX = (Math.random() * 2 - 1) * limit;
				attempts += 1;
			}
			buddyMovementState.fromX = buddyMovementState.x;
			buddyMovementState.targetX = targetX;
			buddyMovementState.segmentStartedAt = timestamp;
			buddyMovementState.segmentDuration = 2800 + Math.abs(targetX - buddyMovementState.x) * 17;
			buddyMovementState.nextDirection = targetX >= buddyMovementState.x ? 1 : -1;
			setBuddyMovementPhase('TURN');
			buddyMovementState.phaseStartedAt = timestamp;
		}

		function updateBuddyMovement(timestamp) {
			buddyMovementFrame = null;
			if (gameShell.classList.contains('is-hidden') || buddy.classList.contains('is-correct') || buddy.classList.contains('is-level-up') || buddy.classList.contains('is-evolving') || buddy.classList.contains('is-wrong')) return;
			if (!buddyMovementState.phaseStartedAt) startBuddyIdle(timestamp);
			if (buddyMovementState.phase === 'IDLE' && timestamp - buddyMovementState.phaseStartedAt >= buddyMovementState.idleDuration) chooseBuddyDestination(timestamp);
			if (buddyMovementState.phase === 'TURN' && timestamp - buddyMovementState.phaseStartedAt >= 260) {
				setBuddyDirection(buddyMovementState.nextDirection);
				setBuddyMovementPhase('WALKING');
				buddyMovementState.segmentStartedAt = timestamp;
			}
			if (buddyMovementState.phase === 'WALKING') {
				const progress = Math.min(1, (timestamp - buddyMovementState.segmentStartedAt) / buddyMovementState.segmentDuration);
				const easedProgress = progress * progress * (3 - 2 * progress);
				buddyMovementState.x = buddyMovementState.fromX + (buddyMovementState.targetX - buddyMovementState.fromX) * easedProgress;
				if (progress === 1) {
					buddyMovementState.x = buddyMovementState.targetX;
					startBuddyIdle(timestamp);
				}
			}
			buddy.style.transform = `translate(calc(-50% + ${buddyMovementState.x}px), 0)`;
			buddyMovementFrame = requestAnimationFrame(updateBuddyMovement);
		}

		function startBuddyMovement() {
			if (buddyMovementFrame !== null || gameShell.classList.contains('is-hidden')) return;
			buddyMovementState.phaseStartedAt = 0;
			buddyMovementFrame = requestAnimationFrame(updateBuddyMovement);
		}

		function pauseBuddyMovement() {
			if (buddyMovementFrame !== null) cancelAnimationFrame(buddyMovementFrame);
			buddyMovementFrame = null;
			buddy.style.transform = '';
			buddy.classList.remove('is-idle', 'is-walking', 'is-turn');
		}
		
		function initializeSelectedDifficulties() {
			if (Array.isArray(currentPlayer?.selectedDifficulties) && currentPlayer.selectedDifficulties.length > 0) {
				selectedDifficulties = currentPlayer.selectedDifficulties;
			} else if (currentPlayer?.difficulty) {
				selectedDifficulties = [currentPlayer.difficulty];
			} else {
				selectedDifficulties = ['twoDigitAddition'];
			}
			currentDifficulty = selectedDifficulties[0];
			updateDifficultyCheckboxes();
		}
		
		function updateDifficultyCheckboxes() {
			const checkboxes = difficultyCheckboxGroup.querySelectorAll('input[type="checkbox"]');
			checkboxes.forEach((checkbox) => {
				checkbox.checked = selectedDifficulties.includes(checkbox.value);
			});
		}

		function randomInteger(minimum, maximum) {
			return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
		}

		function generateQuestion(difficulty) {
			let num1;
			let num2;
			let operator;
			if (difficulty === 'oneDigitAddition') {
				num1 = randomInteger(1, 9);
				num2 = randomInteger(1, 9);
				operator = '+';
			} else if (difficulty === 'twoDigitAddition') {
				num1 = randomInteger(10, 99);
				num2 = randomInteger(10, 99);
				operator = '+';
			} else if (difficulty === 'easyCarryAddition') {
				num1 = randomInteger(11, 19);
				num2 = randomInteger(1, 9);
				while (num1 % 10 + num2 < 10) num2 = randomInteger(1, 9);
				operator = '+';
			} else if (difficulty === 'carryAddition') {
				num1 = randomInteger(10, 99);
				num2 = randomInteger(1, 9);
				while (num1 % 10 + num2 < 10) num1 = randomInteger(10, 99);
				operator = '+';
			} else if (difficulty === 'easyBorrowSubtraction') {
				num1 = randomInteger(10, 18);
				num2 = randomInteger(num1 % 10 + 1, 9);
				operator = '-';
			} else if (difficulty === 'borrowSubtraction') {
				num1 = randomInteger(10, 99);
				num2 = randomInteger(1, Math.min(99, num1 || 99));
				while (num1 % 10 >= num2 % 10 || num1 < num2) {
					num1 = randomInteger(10, 99);
					num2 = randomInteger(1, num1 - 1);
				}
				operator = '-';
			} else if (difficulty === 'multiplication') {
				num1 = randomInteger(2, 9);
				num2 = randomInteger(2, 9);
				operator = '×';
			} else {
				return generateQuestion('twoDigitAddition');
			}
			const answer = operator === '+' ? num1 + num2 : operator === '-' ? num1 - num2 : num1 * num2;
			return { text: `${num1} ${operator} ${num2}`, answer, operator, difficulty, num1, num2 };
		}

		function displayQuestion(question) {
			currentQuestion = question;
			questionText.textContent = `${question.text} = ?`;
		}

		function generateNextQuestion() {
			const selectedDifficulty = selectedDifficulties[randomInteger(0, selectedDifficulties.length - 1)];
			currentDifficulty = selectedDifficulty;
			let nextQuestion = generateQuestion(selectedDifficulty);
			while (currentQuestion && nextQuestion.text === currentQuestion.text && nextQuestion.answer === currentQuestion.answer) nextQuestion = generateQuestion(selectedDifficulty);
			displayQuestion(nextQuestion);
			answerInput.value = '';
			questionStartedAt = Date.now();
		}

		function testQuestionGeneration() {
			const difficulties = ['oneDigitAddition', 'twoDigitAddition', 'easyCarryAddition', 'carryAddition', 'easyBorrowSubtraction', 'borrowSubtraction', 'multiplication'];
			const results = {};
			difficulties.forEach((difficulty) => {
				let previousQuestion = generateQuestion(difficulty);
				results[difficulty] = Array.from({ length: 100 }, () => {
					let question = generateQuestion(difficulty);
					while (question.text === previousQuestion.text && question.answer === previousQuestion.answer) question = generateQuestion(difficulty);
					const valid = Boolean(question.text) && typeof question.answer === 'number' && !Number.isNaN(question.answer) && (question.operator === '+' ? question.answer === question.num1 + question.num2 : question.operator === '-' ? question.answer === question.num1 - question.num2 && question.answer >= 0 : question.answer === question.num1 * question.num2) && (!previousQuestion || question.text !== previousQuestion.text || question.answer !== previousQuestion.answer) && (difficulty !== 'easyCarryAddition' || question.num1 >= 10 && question.num1 <= 19 && question.num2 >= 1 && question.num2 <= 9 && question.num1 % 10 + question.num2 >= 10) && (difficulty !== 'carryAddition' || question.num1 % 10 + question.num2 % 10 >= 10) && (difficulty !== 'easyBorrowSubtraction' || question.num1 >= 10 && question.num1 <= 19 && question.num2 >= 1 && question.num2 <= 9 && question.num1 % 10 < question.num2) && (difficulty !== 'borrowSubtraction' || question.num1 % 10 < question.num2 % 10) && (difficulty !== 'multiplication' || [question.num1, question.num2].every((value) => value >= 2 && value <= 9));
					previousQuestion = question;
					return valid;
				});
			});
			return Object.fromEntries(Object.entries(results).map(([difficulty, checks]) => [difficulty, checks.every(Boolean)]));
		}

		function getSelectedTrainer() {
			return trainerOptions.find((trainer) => trainer.id === currentPlayer?.selectedTrainerId) || trainerOptions[0];
		}

		function bindTrainerImageFallback(image, container) {
			image.addEventListener('load', () => container.classList.add('is-loaded'), { once: true });
			image.addEventListener('error', () => container.classList.remove('is-loaded'), { once: true });
		}

		function renderSelectedTrainer() {
			const trainer = getSelectedTrainer();
			const trainerArea = trainerImage.parentElement;
			trainerArea.classList.remove('is-loaded');
			trainerImage.alt = trainer.name;
			trainerImage.src = trainer.image;
			bindTrainerImageFallback(trainerImage, trainerArea);
		}

		function selectTrainer(trainerId) {
			const trainer = trainerOptions.find((option) => option.id === trainerId) || trainerOptions[0];
			if (currentPlayer) {
				currentPlayer.selectedTrainerId = trainer.id;
				saveGameData();
			}
			renderSelectedTrainer();
			renderTrainerSelection();
		}

		function renderTrainerSelection() {
			const selectedTrainerId = getSelectedTrainer().id;
			trainerList.innerHTML = '';
			trainerOptions.forEach((trainer) => {
				const choice = document.createElement('button');
				choice.type = 'button';
				choice.className = `trainer-choice ${trainer.id === selectedTrainerId ? 'is-selected' : ''}`;
				choice.setAttribute('aria-pressed', String(trainer.id === selectedTrainerId));
				const preview = document.createElement('div');
				preview.className = 'trainer-choice-image';
				const image = document.createElement('img');
				image.src = trainer.image;
				image.alt = trainer.name;
				const placeholder = document.createElement('span');
				placeholder.className = 'trainer-placeholder';
				placeholder.textContent = '';
				preview.append(image, placeholder);
				bindTrainerImageFallback(image, preview);
				const label = document.createElement('span');
				label.textContent = trainer.name;
				choice.append(preview, label);
				choice.addEventListener('click', () => selectTrainer(trainer.id));
				trainerList.appendChild(choice);
			});
		}

		function getBackgroundOptions() {
			return backgroundOptions;
		}

		function getSelectedBackgroundId() {
			return currentPlayer?.backgroundId || 'bg-main';
		}

		function getBackgroundPath(backgroundId) {
			const bg = backgroundOptions.find(b => b.id === backgroundId);
			return bg ? bg.path : backgroundOptions[0].path;
		}

		function applyBackground(backgroundId) {
			const validBg = backgroundOptions.find(b => b.id === backgroundId);
			const bgId = validBg ? backgroundId : backgroundOptions[0].id;
			const bgPath = getBackgroundPath(bgId);
			
			gameShell.style.backgroundImage = '';
			pokemonPanel.style.backgroundImage = `url("${bgPath}")`;
			
			if (currentPlayer) {
				currentPlayer.backgroundId = bgId;
				saveGameData();
			}
		}

		function renderBackgroundSettings() {
			const backgroundSelection = document.querySelector('#backgroundSelection');
			if (!backgroundSelection) return;
			
			backgroundSelection.innerHTML = '';
			const selectedId = getSelectedBackgroundId();
			
			backgroundOptions.forEach(bg => {
				const div = document.createElement('div');
				div.className = `background-option ${bg.id === selectedId ? 'selected' : ''}`;
				div.setAttribute('data-bg-id', bg.id);
				div.innerHTML = `
					<img src="${bg.path}" alt="${bg.name}" onerror="this.style.display='none'">
					<div class="background-option-name">${bg.name}</div>
				`;
				div.addEventListener('click', () => {
					document.querySelectorAll('.background-option').forEach(el => el.classList.remove('selected'));
					div.classList.add('selected');
					applyBackground(bg.id);
				});
				backgroundSelection.appendChild(div);
			});
		}

		function createGameData(name) {
			return { name, starterPokemon: null, currentPokemon: null, activePokemonId: null, pokemonCollection: [], evolutionHistory: [], playerLevel: 1, playerXP: 0, level: 1, xp: 0, currentStreak: 0, bestStreak: 0, encounterCatchStreak: 0, questionsSinceLastEncounter: 0, isEncounterActive: false, currentEncounter: null, totalQuestions: 0, correctAnswers: 0, capturedPokemon: [], pokedex: [], learningHistory: [], level100Celebrated: false, difficulty: 'twoDigitAddition', selectedDifficulties: ['twoDigitAddition'], backgroundId: 'bg-main', selectedTrainerId: 'trainer-1' };
		}

		function loadGameData() {
			try {
				const savedData = JSON.parse(localStorage.getItem(GAME_DATA_KEY));
				if (savedData && typeof savedData === 'object' && Object.prototype.hasOwnProperty.call(savedData, 'name')) return normalizeGameData({ ...createGameData(savedData.name), ...savedData });
				const legacyPlayers = JSON.parse(localStorage.getItem(LEGACY_PLAYER_KEY));
				if (Array.isArray(legacyPlayers) && legacyPlayers[0]) {
					const legacy = legacyPlayers[0];
					return normalizeGameData({ ...createGameData(legacy.name), ...legacy, currentStreak: legacy.currentStreak ?? legacy.streak ?? 0, capturedPokemon: legacy.capturedPokemon ?? legacy.caughtPokemon ?? [], learningHistory: legacy.learningHistory ?? legacy.learningRecords ?? [] });
				}
				return null;
			} catch (error) {
				return null;
			}
		}

		function normalizeGameData(data) {
			const validDifficulties = ['oneDigitAddition', 'twoDigitAddition', 'easyCarryAddition', 'carryAddition', 'easyBorrowSubtraction', 'borrowSubtraction', 'multiplication'];
			const validBackgrounds = backgroundOptions.map(b => b.id);
			const validTrainerIds = trainerOptions.map((trainer) => trainer.id);
			const normalizeSpeciesId = (speciesId) => ({ onyx: 'onix', ryhorn: 'rhyhorn' })[speciesId] || speciesId;
			data.difficulty = validDifficulties.includes(data.difficulty) ? data.difficulty : 'oneDigitAddition';
			data.backgroundId = validBackgrounds.includes(data.backgroundId) ? data.backgroundId : 'bg-main';
			data.selectedTrainerId = validTrainerIds.includes(data.selectedTrainerId) ? data.selectedTrainerId : trainerOptions[0].id;
			data.starterPokemon = normalizeSpeciesId(data.starterPokemon);
			data.currentPokemon = normalizeSpeciesId(data.currentPokemon);
			if (Array.isArray(data.pokedex)) data.pokedex = data.pokedex.map(normalizeSpeciesId);
			
			// Migrate single difficulty to selectedDifficulties array
			if (!Array.isArray(data.selectedDifficulties) || data.selectedDifficulties.length === 0) {
				data.selectedDifficulties = [data.difficulty];
			} else {
				// Validate each difficulty in the array
				data.selectedDifficulties = data.selectedDifficulties.filter(d => validDifficulties.includes(d));
				if (data.selectedDifficulties.length === 0) {
					data.selectedDifficulties = [data.difficulty];
				}
			}
			
			data.currentPokemon = data.currentPokemon || data.starterPokemon || null;
			data.playerXP = Number(data.playerXP ?? 0);
			data.playerLevel = Number(data.playerLevel ?? 1);
			if (!Array.isArray(data.pokemonCollection)) data.pokemonCollection = [];
			if (data.pokemonCollection.length === 0 && data.starterPokemon) {
				const speciesId = data.currentPokemon || data.starterPokemon;
				data.pokemonCollection = [{ id: 'pokemon_001', speciesId, name: starterPokemonData[speciesId]?.name || speciesId, level: data.level || 1, xp: data.xp || 0, evolutionHistory: [], isStarter: true, captured: true }];
			}
			if (!data.activePokemonId && data.pokemonCollection[0]) data.activePokemonId = data.pokemonCollection[0].id;
			data.evolutionHistory = Array.isArray(data.evolutionHistory) ? data.evolutionHistory : [];
			data.pokemonCollection = data.pokemonCollection.map((pokemon) => ({ ...pokemon, speciesId: normalizeSpeciesId(pokemon.speciesId), level: Number(pokemon.level) || 1, xp: Number(pokemon.xp) || 0, evolutionHistory: Array.isArray(pokemon.evolutionHistory) ? pokemon.evolutionHistory.map(normalizeSpeciesId) : [], level100Celebrated: Boolean(pokemon.level100Celebrated) }));
			const uniquePokemon = [];
			const seenSpecies = new Set();
			data.pokemonCollection.forEach((pokemon) => {
				if (pokemon.speciesId && !seenSpecies.has(pokemon.speciesId)) {
					seenSpecies.add(pokemon.speciesId);
					uniquePokemon.push(pokemon);
				}
			});
			data.pokemonCollection = uniquePokemon;
			if (!data.pokemonCollection.some((pokemon) => pokemon.id === data.activePokemonId)) data.activePokemonId = data.pokemonCollection[0]?.id || null;
			if (data.pokemonCollection[0] && data.pokemonCollection[0].evolutionHistory.length === 0 && data.evolutionHistory.length > 0) data.pokemonCollection[0].evolutionHistory = data.evolutionHistory;
			data.level100Celebrated = Boolean(data.level100Celebrated);
			data.encounterCatchStreak = Number(data.encounterCatchStreak) || 0;
			data.questionsSinceLastEncounter = Number(data.questionsSinceLastEncounter) || 0;
			data.isEncounterActive = false;
			data.currentEncounter = null;
			data.captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
			data.level = Math.min(100, getCurrentLevel(Number(data.xp) || 0));
			return data;
		}

		function saveGameData() {
			if (currentPlayer) {
				currentPlayer.isEncounterActive = isEncounterActive;
				currentPlayer.currentEncounter = currentEncounter;
				currentPlayer.captureState = captureState;
				localStorage.setItem(GAME_DATA_KEY, JSON.stringify(currentPlayer));
			}
		}

		function loadPokemonDex() {
			try {
				const savedDex = JSON.parse(localStorage.getItem(DEX_STORAGE_KEY));
				const normalizeSpeciesId = (speciesId) => ({ onyx: 'onix', ryhorn: 'rhyhorn' })[speciesId] || speciesId;
				if (Array.isArray(savedDex)) return [...new Set(savedDex.map(normalizeSpeciesId).filter((speciesId) => typeof speciesId === 'string' && dexSpeciesData[speciesId]))];
				return Array.isArray(currentPlayer?.pokedex) ? [...new Set(currentPlayer.pokedex.map(normalizeSpeciesId).filter((speciesId) => dexSpeciesData[speciesId]))] : [];
			} catch (error) {
				return [];
			}
		}

		function savePokemonDex() {
			pokemonDex = [...new Set(pokemonDex)];
			localStorage.setItem(DEX_STORAGE_KEY, JSON.stringify(pokemonDex));
			if (currentPlayer) currentPlayer.pokedex = [...pokemonDex];
		}

		function registerPokemonInDex(speciesId) {
			if (!speciesId || !getPokemonSpeciesData(speciesId) || pokemonDex.includes(speciesId)) return false;
			pokemonDex.push(speciesId);
			savePokemonDex();
			return true;
		}

		function syncDexFromGameData() {
			if (!currentPlayer) return;
			currentPlayer.pokemonCollection.forEach((pokemon) => registerPokemonInDex(pokemon.speciesId));
			registerPokemonInDex(currentPlayer.starterPokemon);
			savePokemonDex();
		}

		function testRegisterDex(speciesId) {
			return registerPokemonInDex(speciesId);
		}

		function getDexSpeciesList() {
			return Object.keys(dexSpeciesData).sort((first, second) => Number(dexSpeciesData[first].number) - Number(dexSpeciesData[second].number));
		}

		function renderPokemonDex() {
			const discoveredCount = pokemonDex.length;
			dexSummary.textContent = `${discoveredCount} / ${getDexSpeciesList().length}종 발견 · ${Math.round((discoveredCount / getDexSpeciesList().length) * 100)}%`;
			dexGrid.innerHTML = '';
			getDexSpeciesList().forEach((speciesId) => {
				const species = getPokemonSpeciesData(speciesId);
				const dexInfo = dexSpeciesData[speciesId];
				const discovered = pokemonDex.includes(speciesId);
				const card = document.createElement('button');
				card.type = 'button';
				card.className = `dex-card${discovered ? '' : ' undiscovered'}`;
				card.innerHTML = `<span class="dex-number">No. ${dexInfo.number}</span>${renderDexImage(speciesId, discovered)}<strong>${discovered ? species.name : '???'}</strong><small>${discovered ? rarityData[dexInfo.rarity].name : '미발견'}</small>`;
				bindPokemonImageFallback(card);
				card.addEventListener('click', () => showDexDetail(speciesId, discovered));
				dexGrid.appendChild(card);
			});
		}

		function showDexDetail(speciesId, discovered) {
			const species = getPokemonSpeciesData(speciesId);
			const dexInfo = dexSpeciesData[speciesId];
			const ownedPokemon = currentPlayer.pokemonCollection.find((pokemon) => pokemon.speciesId === speciesId);
			dexDetailImage.innerHTML = discovered ? renderPokemonImage(speciesId, { alt: species.name }) : '<span class="pokemon-image-fallback">🖤</span>';
			bindPokemonImageFallback(dexDetailImage);
			dexDetailTitle.textContent = discovered ? `${species.emoji} ${species.name}` : '🖤 ???';
			dexDetailInfo.textContent = `도감번호: ${dexInfo.number} · 희귀도: ${rarityData[dexInfo.rarity].name}`;
			dexDetailOwnership.textContent = ownedPokemon ? `현재 보유: Lv.${ownedPokemon.level}` : '현재 보유: 없음';
			dexDetailProgress.textContent = ownedPokemon ? `XP: ${getXPProgress(ownedPokemon.xp).current} / ${getXPProgress(ownedPokemon.xp).isMax ? 'MAX' : getXPProgress(ownedPokemon.xp).needed}` : '';
			dexDetail.hidden = false;
		}

		function renderPokemonCollection() {
			collectionList.innerHTML = '';
			currentPlayer.pokemonCollection.filter((pokemon) => pokemon.captured !== false).forEach((pokemon) => {
				const species = getPokemonSpeciesData(pokemon.speciesId);
				if (!species) return;
				const progress = getXPProgress(pokemon.xp);
				const card = document.createElement('button');
				card.type = 'button';
				card.className = `collection-card${pokemon.id === currentPlayer.activePokemonId ? ' is-active' : ''}`;
				card.innerHTML = `${renderPokemonImage(pokemon.speciesId, { className: 'collection-emoji', alt: species.name })}<strong>${species.name}</strong><small>Lv.${progress.level}${progress.isMax ? ' MAX!' : ''}</small><small>XP ${progress.current} / ${progress.isMax ? 'MAX' : progress.needed}</small><small>${pokemon.id === currentPlayer.activePokemonId ? '✓ 현재 육성 중' : '터치해서 선택'}</small>`;
				bindPokemonImageFallback(card);
				card.addEventListener('click', () => selectActivePokemon(pokemon.id));
				collectionList.appendChild(card);
			});
		}

		function selectActivePokemon(pokemonId) {
			if (!currentPlayer.pokemonCollection.some((pokemon) => pokemon.id === pokemonId)) return;
			currentPlayer.activePokemonId = pokemonId;
			currentPlayer.currentPokemon = getActivePokemon().speciesId;
			saveGameData();
			updateCurrentPokemonDisplay();
			updateProgressDisplay();
			renderPokemonCollection();
			collectionModal.hidden = true;
		}

		function getRandomMessage(type, messageList) {
			messageList = messageCategories[type] || messageList;
			if (!messageList || messageList.length === 0) return '';
			const previousMessage = lastMessages[type];
			const availableMessages = messageList.length > 1 ? messageList.filter((message) => message !== previousMessage) : messageList;
			const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
			lastMessages[type] = message;
			return message.replaceAll('{name}', currentPlayer ? currentPlayer.name : '친구');
		}

		function getMilestoneMessage(streak) {
			return milestoneMessages[streak] || '';
		}

		function showSetupView(view) {
			[nameSetup, pokemonSetup, pokemonConfirmSetup, adventureIntroSetup].forEach((setupView) => {
				setupView.hidden = setupView !== view;
			});
		}

		function renderStarterChoices() {
			pokemonChoiceList.innerHTML = '';
			starterPokemonIds.forEach((pokemonId) => {
				const pokemon = starterPokemonData[pokemonId];
				const card = document.createElement('button');
				card.type = 'button';
				card.className = `pokemon-choice${selectedStarterPokemon === pokemonId ? ' is-selected' : ''}`;
				card.innerHTML = `${renderPokemonImage(pokemonId, { alt: pokemon.name })}<strong>${pokemon.name}</strong><span class="pokemon-type">${pokemon.type}</span><small>${pokemon.description}</small><span class="selection-mark">${selectedStarterPokemon === pokemonId ? '✓ 선택됨' : ''}</span>`;
				bindPokemonImageFallback(card);
				card.addEventListener('click', () => {
					selectedStarterPokemon = pokemonId;
					renderStarterChoices();
					choosePokemonButton.disabled = false;
				});
				pokemonChoiceList.appendChild(card);
			});
		}

		function beginStarterSetup() {
			playerNameInput.value = currentPlayer ? currentPlayer.name : '';
			showSetupView(currentPlayer && currentPlayer.name ? pokemonSetup : nameSetup);
			if (currentPlayer && currentPlayer.name) {
				pokemonSetupTitle.textContent = `${currentPlayer.name}의 첫 번째 포켓몬을 골라줘!`;
				renderStarterChoices();
				choosePokemonButton.disabled = !selectedStarterPokemon;
			} else playerNameInput.focus();
		}

		function getStarterPokemon() {
			return starterPokemonData[currentPlayer.starterPokemon];
		}

		function getCurrentPokemon() {
			const activePokemon = getActivePokemon();
			return activePokemon ? getPokemonSpeciesData(activePokemon.speciesId) : getPokemonSpeciesData(currentPlayer.currentPokemon || currentPlayer.starterPokemon);
		}

		function getActivePokemon() {
			return currentPlayer.pokemonCollection.find((pokemon) => pokemon.id === currentPlayer.activePokemonId) || currentPlayer.pokemonCollection[0] || null;
		}

		function getEncounterProbability(pokemonLevel) {
			const settingLevel = Object.keys(encounterSettings).map(Number).filter((level) => level <= pokemonLevel).pop();
			return settingLevel ? encounterSettings[settingLevel] : 0;
		}

		function updateEventPanelBounds() {
			const panelBounds = pokemonPanel.getBoundingClientRect();
			[encounterOverlay, captureOverlay].forEach((overlay) => {
				overlay.style.top = `${Math.max(0, panelBounds.top)}px`;
				overlay.style.left = `${Math.max(0, panelBounds.left)}px`;
				overlay.style.right = `${Math.max(0, window.innerWidth - panelBounds.right)}px`;
				overlay.style.bottom = `${Math.max(0, window.innerHeight - panelBounds.bottom)}px`;
			});
		}

		function shouldTriggerEncounter() {
			const activePokemon = getActivePokemon();
			if (!activePokemon || activePokemon.level < 5 || isEncounterActive || currentPlayer.questionsSinceLastEncounter < MIN_QUESTIONS_BETWEEN_ENCOUNTERS) return false;
			return Math.random() < getEncounterProbability(activePokemon.level);
		}

		function renderWildSilhouette(speciesId) {
			wildSilhouette.innerHTML = renderPokemonImage(speciesId, { className: 'wild-pokemon-image', alt: '발견한 포켓몬 실루엣' });
			bindPokemonImageFallback(wildSilhouette);
		}

		function showEncounter(pokemon, resetQuestionSpacing = true) {
			if (!pokemon || isEncounterActive) return false;
			updateEventPanelBounds();
			isEncounterActive = true;
			currentEncounter = { speciesId: pokemon.speciesId, name: pokemon.name, rarity: pokemon.rarity, catchStreakRequired: pokemon.catchStreakRequired };
			if (resetQuestionSpacing) currentPlayer.questionsSinceLastEncounter = 0;
			reactionBubble.classList.remove('show');
			streakBanner.classList.remove('show');
			encounterRarity.textContent = `${rarityData[pokemon.rarity].displayName} 포켓몬을 발견했습니다!`;
			encounterStatus.textContent = '';
			renderWildSilhouette(pokemon.speciesId);
			encounterOverlay.hidden = false;
			saveGameData();
			return true;
		}

		function startCaptureChallenge() {
			if (!currentEncounter || captureState.isActive) return false;
			updateEventPanelBounds();
			captureState = { isActive: true, currentStreak: 0, requiredStreak: getCatchStreakRequired(currentEncounter.rarity) };
			capturePokemonName.textContent = `${currentEncounter.name}를 잡아보자!`;
			captureInstruction.textContent = `이 포켓몬을 잡으려면 ${captureState.requiredStreak}문제를 연속으로 맞혀야 해!`;
			captureProgress.textContent = `⭐ 0 / ${captureState.requiredStreak}`;
			captureResult.textContent = '';
			captureResult.classList.remove('failed');
			captureOverlay.classList.remove('is-result');
			viewCapturedPokemon.hidden = true;
			captureSilhouette.innerHTML = wildSilhouette.innerHTML;
			capturePokemonImage.hidden = true;
			capturePokemonImage.innerHTML = '';
			captureOverlay.hidden = false;
			encounterOverlay.hidden = true;
			saveGameData();
			return true;
		}

		function finishCaptureChallenge() {
			captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
			currentEncounter = null;
			isEncounterActive = false;
			saveGameData();
		}

		function captureSuccess() {
			const captureOutcome = handleSuccessfulCapture(currentEncounter);
			const capturedName = captureOutcome.pokemon ? captureOutcome.pokemon.name : currentEncounter.name;
			captureResult.textContent = captureOutcome.isNew ? `${capturedName}를 잡았습니다! 🎉 새로운 포켓몬이 도감에 등록되었습니다!` : `${capturedName}를 다시 잡았습니다! 🎉 이미 도감에 있는 포켓몬이에요.`;
			capturePokemonImage.innerHTML = renderPokemonImage(currentEncounter?.speciesId || captureOutcome.pokemon?.speciesId, { alt: capturedName });
			bindPokemonImageFallback(capturePokemonImage);
			capturePokemonImage.hidden = false;
			captureSilhouette.querySelector('.buddy')?.classList.add('is-capture-success');
			viewCapturedPokemon.hidden = false;
			captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
			currentEncounter = null;
			isEncounterActive = false;
			captureOverlay.classList.add('is-result');
			saveGameData();
		}

		function handleSuccessfulCapture(capturedPokemon) {
			if (!capturedPokemon || !capturedPokemon.speciesId) return { isNew: false, pokemon: null };
			const isNewDexEntry = registerPokemonInDex(capturedPokemon.speciesId);
			const existingPokemon = currentPlayer.pokemonCollection.find((pokemon) => pokemon.speciesId === capturedPokemon.speciesId);
			if (existingPokemon) return { isNew: isNewDexEntry, pokemon: existingPokemon };
			return { isNew: true, pokemon: addPokemonToCollection(capturedPokemon.speciesId) };
		}

		function captureFailure() {
			captureResult.classList.add('failed');
			captureResult.textContent = '😢 포켓몬이 도망갔습니다! 다음에는 꼭 잡아보자!';
			captureSilhouette.querySelector('.buddy')?.classList.add('is-capture-failed');
			captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
			currentEncounter = null;
			isEncounterActive = false;
			captureOverlay.classList.add('is-result');
			saveGameData();
		}

		function showCollectionAfterCapture() {
			finishCaptureChallenge();
			renderPokemonCollection();
			collectionModal.hidden = false;
			captureOverlay.hidden = true;
		}

		function handleCaptureAnswer(isCorrect) {
			if (!captureState.isActive) return;
			if (isCorrect) {
				captureState.currentStreak += 1;
				captureProgress.textContent = `⭐ ${captureState.currentStreak} / ${captureState.requiredStreak}`;
				if (captureState.currentStreak >= captureState.requiredStreak) captureSuccess();
			} else captureFailure();
			saveGameData();
		}

		function startTestCapture(rarityId, speciesId) {
			const pokemon = wildPokemonData.find((item) => item.speciesId === speciesId && item.rarity === rarityId);
			if (!pokemon) return false;
			currentEncounter = { ...pokemon, catchStreakRequired: getCatchStreakRequired(rarityId) };
			isEncounterActive = true;
			return startCaptureChallenge();
		}

		function triggerTestEncounter() {
			if (isEncounterActive) return false;
			const activePokemon = getActivePokemon();
			const pokemon = activePokemon ? selectWildPokemon(Math.max(5, activePokemon.level)) : selectWildPokemon(5);
			if (!pokemon) return false;
			return showEncounter(pokemon, false);
		}

		function closeEncounter() {
			encounterOverlay.hidden = true;
			isEncounterActive = false;
			currentEncounter = null;
			saveGameData();
		}

		function checkForEncounter() {
			if (!shouldTriggerEncounter()) return;
			const activePokemon = getActivePokemon();
			showEncounter(selectWildPokemon(activePokemon.level));
		}

		function getCatchStreakRequired(rarityId) {
			return rarityData[rarityId]?.catchStreakRequired || 0;
		}

		function getAvailableRarities(pokemonLevel) {
			return Object.values(rarityData)
				.filter((rarity) => pokemonLevel >= rarity.minimumLevel)
				.map((rarity) => rarity.id);
		}

		function selectEncounterRarity(pokemonLevel) {
			const availableRarities = getAvailableRarities(pokemonLevel);
			if (availableRarities.length === 0) return null;
			const totalWeight = availableRarities.reduce((sum, rarityId) => sum + rarityData[rarityId].baseEncounterWeight, 0);
			let roll = Math.random() * totalWeight;
			for (const rarityId of availableRarities) {
				roll -= rarityData[rarityId].baseEncounterWeight;
				if (roll < 0) return rarityId;
			}
			return availableRarities[availableRarities.length - 1];
		}

		function getEncounterablePokemon(pokemonLevel) {
			const availableRarities = getAvailableRarities(pokemonLevel);
			return wildPokemonData.filter((pokemon) => availableRarities.includes(pokemon.rarity) && pokemonLevel >= pokemon.minimumLevel).map((pokemon) => ({ ...pokemon, catchStreakRequired: getCatchStreakRequired(pokemon.rarity) }));
		}

		function selectWildPokemon(pokemonLevel) {
			const rarityId = selectEncounterRarity(pokemonLevel);
			if (!rarityId) return null;
			const candidates = getEncounterablePokemon(pokemonLevel).filter((pokemon) => pokemon.rarity === rarityId);
			return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
		}

		function testEncounterAtLevel(pokemonLevel) {
			const rarities = getAvailableRarities(pokemonLevel);
			const encounter = selectWildPokemon(pokemonLevel);
			console.log(`Lv.${pokemonLevel} 가능한 희귀도:`, rarities.length ? rarities : '없음');
			console.log('선택 가능한 야생 포켓몬:', getEncounterablePokemon(pokemonLevel));
			console.log('랜덤 선택 결과:', encounter);
			return { rarities, encounterablePokemon: getEncounterablePokemon(pokemonLevel), selectedPokemon: encounter };
		}

		function addPokemonToCollection(speciesId) {
			const species = getPokemonSpeciesData(speciesId);
			if (!species) return null;
			const existingPokemon = currentPlayer.pokemonCollection.find((pokemon) => pokemon.speciesId === speciesId);
			if (existingPokemon) return existingPokemon;
			const pokemon = { id: `pokemon_${Date.now()}_${Math.random().toString(16).slice(2)}`, speciesId, name: species.name, level: 1, xp: 0, evolutionHistory: [], level100Celebrated: false, isStarter: false, captured: true };
			currentPlayer.pokemonCollection.push(pokemon);
			saveGameData();
			return pokemon;
		}

		// 개발 테스트 기능: 실제 포획 시스템과 분리해 쉽게 제거할 수 있다.
		function addTestPokemon() {
			if (currentPlayer.pokemonCollection.some((pokemon) => pokemon.isTestPokemon === true || pokemon.speciesId === 'pikachu')) return null;
			const testPokemon = addPokemonToCollection('pikachu');
			if (!testPokemon) return null;
			testPokemon.isTestPokemon = true;
			saveGameData();
			return testPokemon;
		}

		function removeTestPokemon() {
			const activePokemon = getActivePokemon();
			currentPlayer.pokemonCollection = currentPlayer.pokemonCollection.filter((pokemon) => pokemon.isTestPokemon !== true);
			if (activePokemon && activePokemon.isTestPokemon) {
				currentPlayer.activePokemonId = currentPlayer.pokemonCollection[0]?.id || null;
				currentPlayer.currentPokemon = currentPlayer.pokemonCollection[0]?.speciesId || currentPlayer.starterPokemon;
				updateCurrentPokemonDisplay();
				updateProgressDisplay();
			}
			saveGameData();
		}

		function getRequiredTotalXP(levelNumber) {
			const xpToNextLevel = [0, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 610, 640, 670, 700, 730, 760, 790, 820, 850, 880, 920, 960, 1000, 1040, 1080, 1120, 1160, 1200, 1240, 1280, 1330, 1380, 1430, 1480, 1530, 1580, 1630, 1680, 1730, 1780, 1840, 1900, 1960, 2020, 2080, 2140, 2200, 2260, 2320, 2380, 2450, 2520, 2590, 2660, 2730, 2800, 2870, 2940, 3010, 3080, 3160, 3240, 3320, 3400, 3480, 3560, 3640, 3720, 3800, 3880];
			if (levelNumber <= 1) return 0;
			return xpToNextLevel.slice(0, Math.min(100, levelNumber)).reduce((total, requiredXP) => total + requiredXP, 0);
		}

		function getCurrentLevel(totalXP) {
			let calculatedLevel = 1;
			for (let levelNumber = 2; levelNumber <= 100; levelNumber += 1) {
				if (totalXP < getRequiredTotalXP(levelNumber)) break;
				calculatedLevel = levelNumber;
			}
			return calculatedLevel;
		}

		function getXPProgress(totalXP) {
			const currentLevel = getCurrentLevel(totalXP);
			if (currentLevel >= 100) return { level: 100, current: totalXP, needed: 0, percent: 100, isMax: true };
			const levelStartXP = getRequiredTotalXP(currentLevel);
			const nextLevelXP = getRequiredTotalXP(currentLevel + 1);
			const needed = nextLevelXP - levelStartXP;
			const current = Math.max(0, totalXP - levelStartXP);
			return { level: currentLevel, current, needed, percent: Math.min(100, Math.round((current / needed) * 100)), isMax: false };
		}

		function getBaseQuestionXP(difficulty) {
			return { oneDigitAddition: 10, twoDigitAddition: 15, easyCarryAddition: 18, carryAddition: 25, easyBorrowSubtraction: 18, borrowSubtraction: 25, multiplication: 30 }[difficulty] || 10;
		}

		function getStreakBonusRate(streak) {
			if (streak >= 25) return 0.35;
			if (streak >= 20) return 0.30;
			if (streak >= 15) return 0.25;
			if (streak >= 10) return 0.20;
			if (streak >= 5) return 0.10;
			return 0;
		}

		function calculateQuestionXP(question, streak) {
			const baseXP = getBaseQuestionXP(question?.difficulty);
			return Math.round(baseXP * (1 + getStreakBonusRate(streak)));
		}

		function testXPSystem() {
			const expectedBaseXP = { oneDigitAddition: 10, twoDigitAddition: 15, easyCarryAddition: 18, carryAddition: 25, easyBorrowSubtraction: 18, borrowSubtraction: 25, multiplication: 30 };
			const baseXP = Object.fromEntries(Object.entries(expectedBaseXP).map(([difficulty, expected]) => [difficulty, calculateQuestionXP({ difficulty }, 1) === expected]));
			const streakXP = { 1: 10, 5: 11, 10: 12, 15: 13, 20: 13, 25: 14, 30: 14 };
			const streakBonus = Object.fromEntries(Object.entries(streakXP).map(([streak, expected]) => [streak, calculateQuestionXP({ difficulty: 'oneDigitAddition' }, Number(streak)) === expected]));
			const levelUpXP = getRequiredTotalXP(2);
			const multiLevelXP = getRequiredTotalXP(4) + 5;
			return { baseXP, streakBonus, levelUp: getCurrentLevel(levelUpXP - 5 + 10) === 2, multiLevel: getCurrentLevel(multiLevelXP) === 4, level100: getCurrentLevel(getRequiredTotalXP(100) + 1000) === 100 };
		}

		function updateProgressDisplay() {
			const activePokemon = getActivePokemon();
			const progress = getXPProgress(activePokemon ? activePokemon.xp : 0);
			level.textContent = progress.isMax ? '100 MAX!' : progress.level;
			xp.textContent = progress.current;
			xpNext.textContent = progress.isMax ? 'MAX' : progress.needed;
			xpProgressBar.style.width = `${progress.percent}%`;
			currentPlayer.level = progress.level;
			updateNextEvolutionDisplay();
		}

		function updateCurrentPokemonDisplay() {
			const activePokemon = getActivePokemon();
			const pokemon = getCurrentPokemon();
			if (!activePokemon || !pokemon) return;
			buddyImage.innerHTML = renderPokemonImage(activePokemon.speciesId, { className: 'buddy-pokemon', alt: pokemon.name });
			bindPokemonImageFallback(buddyImage);
			starterDisplay.innerHTML = `${renderPokemonImage(activePokemon.speciesId, { alt: pokemon.name })}${pokemon.name}${pokemon.type ? `<span class="starter-type">${pokemon.type}</span>` : ''}`;
			bindPokemonImageFallback(starterDisplay);
			updateNextEvolutionDisplay();
			startBuddyMovement();
		}

		function getRandomStarterMessage() {
			const availableMessages = starterMessages.filter((message) => message !== lastMessages.starter);
			const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
			lastMessages.starter = message;
			return message.replace('{name}', currentPlayer.name).replace('{pokemonName}', getStarterPokemon().name);
		}

		function showMessage(message, type = 'normal', force = false) {
			if (!message || (!force && reactionBubble.classList.contains('show'))) return false;
			clearTimeout(messageTimer);
			const duration = type === 'levelUp' ? 2500 : type === 'milestone' ? 2000 : type === 'start' ? 1800 : 1600;
			reactionBubble.textContent = message;
			reactionBubble.style.setProperty('--message-duration', `${duration}ms`);
			reactionBubble.className = `reaction-bubble message-${type}`;
			restartAnimation(reactionBubble, 'show');
			messageTimer = setTimeout(() => {
				reactionBubble.classList.remove('show');
			}, duration);
			return true;
		}

		function startGame(showStartMessage = true) {
			const currentPokemon = getCurrentPokemon();
			if (!currentPlayer || !currentPlayer.name || !currentPokemon) return;
			streakCount = currentPlayer.currentStreak;
			updateProgressDisplay();
			displayPlayerName.textContent = currentPlayer.name;
			currentPlayerName.textContent = `현재 플레이어: ${currentPlayer.name}`;
			updateCurrentPokemonDisplay();
			initializeSelectedDifficulties();
			applyBackground(getSelectedBackgroundId());
			renderSelectedTrainer();
			if (!currentQuestion) displayQuestion(generateQuestion(currentDifficulty));
			playerScreen.classList.add('is-hidden');
			gameShell.classList.remove('is-hidden');
			startBuddyMovement();
			if (showStartMessage) showMessage(getRandomMessage('start'), 'start');
			questionStartedAt = Date.now();
		}

		function createSinglePlayer(name) {
			const cleanName = name.trim();
			if (!cleanName) return;
			currentPlayer = currentPlayer && currentPlayer.name === cleanName ? currentPlayer : createGameData(cleanName);
			playerNameInput.value = cleanName;
			saveGameData();
			pokemonSetupTitle.textContent = `${cleanName}의 첫 번째 포켓몬을 골라줘!`;
			selectedStarterPokemon = null;
			choosePokemonButton.disabled = true;
			renderStarterChoices();
			showSetupView(pokemonSetup);
		}

		function openParentMenu() {
			parentModal.hidden = false;
			parentLockView.hidden = false;
			parentManageView.hidden = true;
			parentPassword.value = '';
			parentError.textContent = '';
			parentPassword.focus();
		}

		function closeParentMenu() {
			parentModal.hidden = true;
		}

		function resetGameData() {
			const preservedDifficulty = currentPlayer?.difficulty || currentDifficulty;
			const preservedSelectedDifficulties = currentPlayer?.selectedDifficulties || selectedDifficulties;
			const preservedBackgroundId = currentPlayer?.backgroundId || 'bg-main';
			const preservedTrainerId = getSelectedTrainer().id;
			currentPlayer = createGameData('');
			currentPlayer.difficulty = preservedDifficulty;
			currentPlayer.selectedDifficulties = preservedSelectedDifficulties;
			currentPlayer.backgroundId = preservedBackgroundId;
			currentPlayer.selectedTrainerId = preservedTrainerId;
			currentDifficulty = preservedDifficulty;
			selectedDifficulties = preservedSelectedDifficulties;
			streakCount = 0;
			questionStartedAt = Date.now();
			previousAnswerWasWrong = false;
			selectedStarterPokemon = null;
			currentQuestion = null;
			isEncounterActive = false;
			currentEncounter = null;
			captureState = { isActive: false, currentStreak: 0, requiredStreak: 0 };
			answerInput.value = '';
			encounterOverlay.hidden = true;
			captureOverlay.hidden = true;
			collectionModal.hidden = true;
			trainerModal.hidden = true;
			dexModal.hidden = true;
			dexDetail.hidden = true;
			resetModal.hidden = true;
			parentModal.hidden = true;
			saveGameData();
			playerScreen.classList.remove('is-hidden');
			gameShell.classList.add('is-hidden');
			showSetupView(nameSetup);
			beginStarterSetup();
		}

		function renamePlayer() {
			renameInput.value = currentPlayer.name;
			renameForm.hidden = false;
			renameInput.focus();
		}

		function saveRenamedPlayer() {
			const name = renameInput.value.trim();
			if (!name) return;
			currentPlayer.name = name;
			displayPlayerName.textContent = currentPlayer.name;
			currentPlayerName.textContent = `현재 플레이어: ${currentPlayer.name}`;
			saveGameData();
			renameForm.hidden = true;
		}

		function confirmStarterSelection() {
			if (!selectedStarterPokemon) return;
			const pokemon = starterPokemonData[selectedStarterPokemon];
			pokemonConfirmTitle.textContent = `${currentPlayer.name}, 정말 ${pokemon.name}와 함께 시작할까?`;
			pokemonConfirmDescription.textContent = `${pokemon.emoji} ${pokemon.name}가 너의 첫 번째 포켓몬이야!`;
			showSetupView(pokemonConfirmSetup);
		}

		function startAdventure() {
			currentPlayer.starterPokemon = selectedStarterPokemon;
			currentPlayer.currentPokemon = selectedStarterPokemon;
			currentPlayer.pokemonCollection = [{ id: 'pokemon_001', speciesId: selectedStarterPokemon, name: starterPokemonData[selectedStarterPokemon].name, level: 1, xp: 0, evolutionHistory: [], level100Celebrated: false, isStarter: true, captured: true }];
			currentPlayer.activePokemonId = 'pokemon_001';
			currentPlayer.evolutionHistory = [];
			registerPokemonInDex(selectedStarterPokemon);
			saveGameData();
			adventureIntroMessage.textContent = `${currentPlayer.name}과(와) ${getStarterPokemon().name}의 모험이 시작된다!`;
			showSetupView(adventureIntroSetup);
			setTimeout(() => {
				startGame(false);
				showMessage(getRandomStarterMessage(), 'start', true);
			}, 1800);
		}

		function restartAnimation(element, className) {
			element.classList.remove(className);
			void element.offsetWidth;
			element.classList.add(className);
		}

		function showBubble(message) { showMessage(message, 'normal', true); }

		function showSparkles(count) {
			sparkles.innerHTML = '';
			for (let index = 0; index < count; index += 1) {
				const sparkle = document.createElement('span');
				sparkle.className = 'sparkle';
				sparkle.textContent = '✦';
				sparkles.appendChild(sparkle);
			}
		}

		function playPokemonReaction(isCorrect, isLevelUp = false, isEvolution = false) {
			clearTimeout(reactionTimer);
			pauseBuddyMovement();
			buddy.className = 'buddy';
			sparkles.innerHTML = '';
			if (isCorrect) {
				const milestone = streakMilestones[streakCount];
				buddy.classList.add(isEvolution ? 'is-evolving' : isLevelUp ? 'is-level-up' : 'is-correct');
				if (milestone) buddy.classList.add(milestone.reactionClass);
				showSparkles(isEvolution || isLevelUp ? 6 : milestone ? milestone.stars : 2);
				xpFloat.classList.remove('show');
				void xpFloat.offsetWidth;
				xpFloat.classList.add('show');
				if (milestone && !isLevelUp) {
					streakBanner.textContent = getMilestoneMessage(streakCount);
					restartAnimation(streakBanner, 'show');
				} else {
					streakBanner.classList.remove('show');
					streakBanner.textContent = '';
				}
			} else {
				buddy.classList.add('is-wrong');
				streakBanner.classList.remove('show');
				streakBanner.textContent = '';
			}
			reactionTimer = setTimeout(() => {
				buddy.className = 'buddy';
				sparkles.innerHTML = '';
				startBuddyMovement();
			}, isEvolution ? 2600 : isLevelUp ? 2100 : 1100);
		}

		function checkForLevelUp(previousLevel) {
			const activePokemon = getActivePokemon();
			const nextLevel = getCurrentLevel(activePokemon.xp);
			activePokemon.level = nextLevel;
			return nextLevel > previousLevel;
		}

		function checkForEvolution(newLevel) {
			const activePokemon = getActivePokemon();
			const currentPokemonId = activePokemon.speciesId;
			const evolution = evolutionData[currentPokemonId];
			if (!evolution || !evolution.next || evolution.evolutionMethod !== 'level' || !evolution.evolutionLevel || newLevel < evolution.evolutionLevel || activePokemon.evolutionHistory.includes(evolution.next)) return null;
			return { from: currentPokemonId, to: evolution.next };
		}

		function applyEvolution(evolution) {
			const activePokemonIndex = currentPlayer.pokemonCollection.findIndex((pokemon) => pokemon.id === currentPlayer.activePokemonId);
			if (activePokemonIndex < 0) return '';
			const activePokemon = currentPlayer.pokemonCollection[activePokemonIndex];
			const evolvedPokemon = {
				...activePokemon,
				speciesId: evolution.to,
				name: starterPokemonData[evolution.to].name,
				evolutionHistory: [...activePokemon.evolutionHistory, evolution.to]
			};
			currentPlayer.pokemonCollection[activePokemonIndex] = evolvedPokemon;
			currentPlayer.activePokemonId = evolvedPokemon.id;
			currentPlayer.currentPokemon = evolvedPokemon.speciesId;
			registerPokemonInDex(evolution.to);
			updateCurrentPokemonDisplay();
			saveGameData();
			return `${starterPokemonData[evolution.from].name}가 진화했다!`;
		}

		function checkForFastAnswer() {
			return Date.now() - questionStartedAt <= FAST_ANSWER_TIME;
		}

		function checkForRecoveryAnswer() {
			return previousAnswerWasWrong;
		}

		function handleCorrectAnswer(isCaptureAnswer = false) {
			const activePokemon = getActivePokemon();
			const previousLevel = activePokemon.level;
			if (!isCaptureAnswer) streakCount += 1;
			currentPlayer.correctAnswers += 1;
			if (!isCaptureAnswer) {
				currentPlayer.currentStreak = streakCount;
				currentPlayer.bestStreak = Math.max(currentPlayer.bestStreak, streakCount);
			}
			const milestoneData = isCaptureAnswer ? null : streakMilestones[streakCount];
			const earnedXP = calculateQuestionXP(currentQuestion, isCaptureAnswer ? 1 : streakCount);
			activePokemon.xp += earnedXP;
			const levelUp = checkForLevelUp(previousLevel);
			const reachedMaxLevel = !activePokemon.level100Celebrated && previousLevel < 100 && activePokemon.level === 100;
			if (reachedMaxLevel) activePokemon.level100Celebrated = true;
			const evolution = levelUp ? checkForEvolution(activePokemon.level) : null;
			if (evolution) applyEvolution(evolution);
			const milestone = isCaptureAnswer ? '' : getMilestoneMessage(streakCount);
			let message;
			let messageType;
			if (evolution) {
				message = `${currentPlayer.name}의 ${starterPokemonData[evolution.from].name}가 ${starterPokemonData[evolution.to].name}로 진화했어!`;
				messageType = 'levelUp';
			} else if (reachedMaxLevel) {
				message = getRandomMessage('maxLevel');
				messageType = 'levelUp';
			} else if (levelUp) {
				message = getRandomMessage('levelUp');
				messageType = 'levelUp';
			} else if (milestone) {
				message = milestone;
				messageType = 'milestone';
			} else if (!isCaptureAnswer && checkForRecoveryAnswer()) {
				message = getRandomMessage('recovery');
				messageType = 'recovery';
			} else if (checkForFastAnswer()) {
				message = getRandomMessage('speed');
				messageType = 'speed';
			} else if (!isCaptureAnswer && streakCount > 1 && Math.random() < .35) {
				message = getRandomMessage('streak');
				messageType = 'streak';
			} else {
				message = Math.random() < .35 ? getRandomMessage('correct') : '정답! 🎉';
				messageType = 'correct';
			}
			feedback.textContent = '정답입니다!';
			feedback.className = 'feedback correct';
			updateProgressDisplay();
			xpFloat.textContent = `+${earnedXP} XP`;
			playPokemonReaction(true, levelUp, Boolean(evolution));
			showMessage(message, messageType, true);
			if (!isCaptureAnswer) previousAnswerWasWrong = false;
		}

		function handleWrongAnswer() {
			streakCount = 0;
			currentPlayer.currentStreak = 0;
			feedback.textContent = '다시 생각해보세요!';
			feedback.className = 'feedback wrong';
			playPokemonReaction(false);
			showMessage(getRandomMessage('wrong'), 'wrong', true);
			previousAnswerWasWrong = true;
		}

		function checkAnswer() {
			if (!currentPlayer) return;
			currentPlayer.totalQuestions += 1;
			currentPlayer.questionsSinceLastEncounter += 1;
			const isCorrect = answerInput.value.trim() !== '' && Number(answerInput.value) === currentQuestion.answer;
			if (isCorrect) {
				if (captureState.isActive) {
					handleCorrectAnswer(true);
					handleCaptureAnswer(true);
				} else if (!captureState.isActive) handleCorrectAnswer();
			} else {
				if (captureState.isActive) handleCaptureAnswer(false);
				else if (!captureState.isActive) handleWrongAnswer();
			}
			if (isCorrect) generateNextQuestion();
			questionStartedAt = Date.now();
			saveGameData();
			if (!captureState.isActive && !isEncounterActive) checkForEncounter();
		}

		onboardingForm.addEventListener('submit', (event) => {
			event.preventDefault();
			createSinglePlayer(playerNameInput.value);
		});
		choosePokemonButton.addEventListener('click', confirmStarterSelection);
		document.querySelector('#chooseAgainButton').addEventListener('click', () => showSetupView(pokemonSetup));
		document.querySelector('#startAdventureButton').addEventListener('click', startAdventure);
		document.querySelector('#parentMenuButton').addEventListener('click', openParentMenu);
		document.querySelector('#unlockParent').addEventListener('click', () => {
			if (parentPassword.value === PARENT_PASSWORD) {
				parentLockView.hidden = true;
				parentManageView.hidden = false;
				parentError.textContent = '';
				currentPlayerName.textContent = `현재 플레이어: ${currentPlayer.name}`;
				renderBackgroundSettings();
			} else {
				parentError.textContent = '비밀번호를 다시 확인해 주세요.';
			}
		});
		document.querySelector('#closeParent').addEventListener('click', closeParentMenu);
		document.querySelector('#closeParentAfterManage').addEventListener('click', closeParentMenu);
		document.querySelector('#openResetData').addEventListener('click', () => {
			resetModal.hidden = false;
		});
		document.querySelector('#cancelResetData').addEventListener('click', () => {
			resetModal.hidden = true;
		});
		document.querySelector('#confirmResetData').addEventListener('click', resetGameData);
		// Checkbox difficulty selection event listener
		const difficultyCheckboxes = difficultyCheckboxGroup.querySelectorAll('input[type="checkbox"]');
		difficultyCheckboxes.forEach((checkbox) => {
			checkbox.addEventListener('change', () => {
				const checkedDifficulties = Array.from(difficultyCheckboxGroup.querySelectorAll('input[type="checkbox"]:checked')).map((cb) => cb.value);
				
				// Ensure minimum 1 difficulty is selected
				if (checkedDifficulties.length === 0) {
					checkbox.checked = true;
					alert('최소 1개 이상의 난이도를 선택해주세요.');
					return;
				}
				
				selectedDifficulties = checkedDifficulties;
				currentDifficulty = selectedDifficulties[0];
				
				if (currentPlayer) {
					currentPlayer.selectedDifficulties = selectedDifficulties;
					currentPlayer.difficulty = currentDifficulty;
					saveGameData();
				}
				
				// Only generate next question if game is active
				if (!playerScreen.classList.contains('is-hidden')) {
					generateNextQuestion();
				}
			});
		});
		document.querySelector('#renamePlayer').addEventListener('click', renamePlayer);
		document.querySelector('#addTestPokemonButton').addEventListener('click', () => {
			addTestPokemon();
		});
		document.querySelector('#removeTestPokemonButton').addEventListener('click', () => {
			removeTestPokemon();
		});
		changePokemonButton.addEventListener('click', () => {
			renderPokemonCollection();
			collectionModal.hidden = false;
		});
		changeTrainerButton.addEventListener('click', () => {
			renderTrainerSelection();
			trainerModal.hidden = false;
		});
		document.querySelector('#closeCollection').addEventListener('click', () => {
			collectionModal.hidden = true;
		});
		document.querySelector('#closeTrainer').addEventListener('click', () => {
			trainerModal.hidden = true;
		});
		document.querySelector('#openDexButton').addEventListener('click', () => {
			syncDexFromGameData();
			renderPokemonDex();
			dexModal.hidden = false;
		});
		document.querySelector('#closeDex').addEventListener('click', () => {
			dexModal.hidden = true;
		});
		document.querySelector('#closeDexDetail').addEventListener('click', () => {
			dexDetail.hidden = true;
		});
		document.querySelector('#challengeEncounter').addEventListener('click', startCaptureChallenge);
		document.querySelector('#closeEncounter').addEventListener('click', closeEncounter);
		document.querySelector('#closeCapture').addEventListener('click', () => {
			captureOverlay.hidden = true;
			finishCaptureChallenge();
		});
		viewCapturedPokemon.addEventListener('click', showCollectionAfterCapture);
		renameForm.addEventListener('submit', (event) => {
			event.preventDefault();
			saveRenamedPlayer();
		});
		document.querySelector('#cancelRename').addEventListener('click', () => {
			renameForm.hidden = true;
		});
		parentPassword.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') document.querySelector('#unlockParent').click();
		});
		window.addEventListener('resize', updateEventPanelBounds);
		updateEventPanelBounds();
		if (currentPlayer && currentPlayer.name && currentPlayer.starterPokemon && getStarterPokemon()) {
			syncDexFromGameData();
			startGame();
			saveGameData();
		}
		else {
			playerScreen.classList.remove('is-hidden');
			gameShell.classList.add('is-hidden');
			beginStarterSetup();
		}

		document.querySelectorAll('[data-key]').forEach((keyButton) => {
			keyButton.addEventListener('click', () => {
				const key = keyButton.dataset.key;
				if (key === 'delete') answerInput.value = answerInput.value.slice(0, -1);
				else if (key === 'confirm') checkAnswer();
				else if (answerInput.value.length < 3) answerInput.value += key;
				if (key !== 'confirm') answerInput.focus();
			});
		});

		answerInput.addEventListener('input', () => {
			answerInput.value = answerInput.value.replace(/[^0-9]/g, '').slice(0, 3);
		});
		answerInput.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') checkAnswer();
		});
	