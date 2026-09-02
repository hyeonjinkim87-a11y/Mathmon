const pokemonImageData = {
			charmander: { image: 'assets/pokemon/001-charmander.png' }, charmeleon: { image: 'assets/pokemon/002-charmeleon.png' }, charizard: { image: 'assets/pokemon/003-charizard.png' },
			bulbasaur: { image: 'assets/pokemon/004-bulbasaur.png' }, ivysaur: { image: 'assets/pokemon/005-ivysaur.png' }, venusaur: { image: 'assets/pokemon/006-venusaur.png' },
			squirtle: { image: 'assets/pokemon/007-squirtle.png' }, wartortle: { image: 'assets/pokemon/008-wartortle.png' }, blastoise: { image: 'assets/pokemon/009-blastoise.png' },
			pikachu: { image: 'assets/pokemon/010-pikachu.png' }, raichu: { image: 'assets/pokemon/011-raichu.png' }, pidgey: { image: 'assets/pokemon/012-pidgey.png' }, rattata: { image: 'assets/pokemon/013-rattata.png' },
			dratini: { image: 'assets/pokemon/014-dratini.png' }, snorlax: { image: 'assets/pokemon/015-snorlax.png' }, articuno: { image: 'assets/pokemon/016-articuno.png' }, mew: { image: 'assets/pokemon/017-mew.png' }
		};
		const starterPokemonData = {
			charmander: { name: '파이리', emoji: '🔥', type: '불꽃 타입', description: '뜨거운 불꽃과 함께 모험을 시작해보자!', evolution: 'charmeleon' },
			charmeleon: { name: '리자드', emoji: '🔥', type: '불꽃 타입', evolution: 'charizard' },
			charizard: { name: '리자몽', emoji: '🔥', type: '불꽃 타입' },
			bulbasaur: { name: '이상해씨', emoji: '🌿', type: '풀/독 타입', description: '든든한 친구와 함께 천천히 성장해보자!', evolution: 'ivysaur' },
			ivysaur: { name: '이상해풀', emoji: '🌿', type: '풀/독 타입', evolution: 'venusaur' },
			venusaur: { name: '이상해꽃', emoji: '🌿', type: '풀/독 타입' },
			squirtle: { name: '꼬북이', emoji: '💧', type: '물 타입', description: '시원한 물의 힘으로 모험을 떠나자!', evolution: 'wartortle' },
			wartortle: { name: '어니부기', emoji: '💧', type: '물 타입', evolution: 'blastoise' },
			blastoise: { name: '거북왕', emoji: '💧', type: '물 타입' },
			pikachu: { name: '피카츄', emoji: '⚡', type: '전기 타입', description: '짜릿한 전기와 함께 힘차게 출발하자!', evolution: { method: 'item', requiredItem: 'thunder_stone', next: 'raichu' } },
			raichu: { name: '라이츄', emoji: '⚡', type: '전기 타입' }
		};
		const dexSpeciesData = {};
		const starterPokemonIds = ['charmander', 'bulbasaur', 'squirtle', 'pikachu'];
		const evolutionData = {
			bulbasaur: { next: 'ivysaur', evolutionLevel: 16, evolutionMethod: 'level' },
			ivysaur: { next: 'venusaur', evolutionLevel: 32, evolutionMethod: 'level' },
			venusaur: { next: null, evolutionLevel: null, evolutionMethod: null },
			charmander: { next: 'charmeleon', evolutionLevel: 16, evolutionMethod: 'level' },
			charmeleon: { next: 'charizard', evolutionLevel: 36, evolutionMethod: 'level' },
			charizard: { next: null, evolutionLevel: null, evolutionMethod: null },
			squirtle: { next: 'wartortle', evolutionLevel: 16, evolutionMethod: 'level' },
			wartortle: { next: 'blastoise', evolutionLevel: 36, evolutionMethod: 'level' },
			blastoise: { next: null, evolutionLevel: null, evolutionMethod: null },
			caterpie: { next: 'metapod', evolutionLevel: 7, evolutionMethod: 'level' },
			metapod: { next: 'butterfree', evolutionLevel: 10, evolutionMethod: 'level' },
			butterfree: { next: null, evolutionLevel: null, evolutionMethod: null },
			weedle: { next: 'kakuna', evolutionLevel: 7, evolutionMethod: 'level' },
			kakuna: { next: 'beedrill', evolutionLevel: 10, evolutionMethod: 'level' },
			beedrill: { next: null, evolutionLevel: null, evolutionMethod: null },
			pidgey: { next: 'pidgeotto', evolutionLevel: 18, evolutionMethod: 'level' },
			pidgeotto: { next: 'pidgeot', evolutionLevel: 36, evolutionMethod: 'level' },
			pidgeot: { next: null, evolutionLevel: null, evolutionMethod: null },
			rattata: { next: 'raticate', evolutionLevel: 20, evolutionMethod: 'level' },
			raticate: { next: null, evolutionLevel: null, evolutionMethod: null },
			spearow: { next: 'fearow', evolutionLevel: 20, evolutionMethod: 'level' },
			fearow: { next: null, evolutionLevel: null, evolutionMethod: null },
			ekans: { next: 'arbok', evolutionLevel: 22, evolutionMethod: 'level' },
			arbok: { next: null, evolutionLevel: null, evolutionMethod: null },
			sandshrew: { next: 'sandslash', evolutionLevel: 22, evolutionMethod: 'level' },
			sandslash: { next: null, evolutionLevel: null, evolutionMethod: null },
			'nidoran-f': { next: 'nidorina', evolutionLevel: 16, evolutionMethod: 'level' },
			nidorina: { next: 'nidoqueen', evolutionLevel: null, evolutionMethod: 'stone' },
			nidoqueen: { next: null, evolutionLevel: null, evolutionMethod: null },
			'nidoran-m': { next: 'nidorino', evolutionLevel: 16, evolutionMethod: 'level' },
			nidorino: { next: 'nidoking', evolutionLevel: null, evolutionMethod: 'stone' },
			nidoking: { next: null, evolutionLevel: null, evolutionMethod: null },
			clefairy: { next: 'clefable', evolutionLevel: null, evolutionMethod: 'stone' },
			clefable: { next: null, evolutionLevel: null, evolutionMethod: null },
			vulpix: { next: 'ninetales', evolutionLevel: null, evolutionMethod: 'stone' },
			ninetales: { next: null, evolutionLevel: null, evolutionMethod: null },
			jigglypuff: { next: 'wigglytuff', evolutionLevel: null, evolutionMethod: 'stone' },
			wigglytuff: { next: null, evolutionLevel: null, evolutionMethod: null },
			zubat: { next: 'golbat', evolutionLevel: 22, evolutionMethod: 'level' },
			golbat: { next: null, evolutionLevel: null, evolutionMethod: null },
			oddish: { next: 'gloom', evolutionLevel: 21, evolutionMethod: 'level' },
			gloom: { next: 'vileplume', evolutionLevel: null, evolutionMethod: 'stone' },
			vileplume: { next: null, evolutionLevel: null, evolutionMethod: null },
			paras: { next: 'parasect', evolutionLevel: 24, evolutionMethod: 'level' },
			parasect: { next: null, evolutionLevel: null, evolutionMethod: null },
			venonat: { next: 'venomoth', evolutionLevel: 31, evolutionMethod: 'level' },
			venomoth: { next: null, evolutionLevel: null, evolutionMethod: null },
			diglett: { next: 'dugtrio', evolutionLevel: 26, evolutionMethod: 'level' },
			dugtrio: { next: null, evolutionLevel: null, evolutionMethod: null },
			meowth: { next: 'persian', evolutionLevel: 28, evolutionMethod: 'level' },
			persian: { next: null, evolutionLevel: null, evolutionMethod: null },
			psyduck: { next: 'golduck', evolutionLevel: 33, evolutionMethod: 'level' },
			golduck: { next: null, evolutionLevel: null, evolutionMethod: null },
			mankey: { next: 'primeape', evolutionLevel: 28, evolutionMethod: 'level' },
			primeape: { next: null, evolutionLevel: null, evolutionMethod: null },
			growlithe: { next: 'arcanine', evolutionLevel: null, evolutionMethod: 'stone' },
			arcanine: { next: null, evolutionLevel: null, evolutionMethod: null },
			poliwag: { next: 'poliwhirl', evolutionLevel: 25, evolutionMethod: 'level' },
			poliwhirl: { next: 'poliwrath', evolutionLevel: null, evolutionMethod: 'stone' },
			poliwrath: { next: null, evolutionLevel: null, evolutionMethod: null },
			abra: { next: 'kadabra', evolutionLevel: 16, evolutionMethod: 'level' },
			kadabra: { next: 'alakazam', evolutionLevel: null, evolutionMethod: 'trade' },
			alakazam: { next: null, evolutionLevel: null, evolutionMethod: null },
			machop: { next: 'machoke', evolutionLevel: 28, evolutionMethod: 'level' },
			machoke: { next: 'machamp', evolutionLevel: null, evolutionMethod: 'trade' },
			machamp: { next: null, evolutionLevel: null, evolutionMethod: null },
			bellsprout: { next: 'weepinbell', evolutionLevel: 21, evolutionMethod: 'level' },
			weepinbell: { next: 'victreebel', evolutionLevel: null, evolutionMethod: 'stone' },
			victreebel: { next: null, evolutionLevel: null, evolutionMethod: null },
			tentacool: { next: 'tentacruel', evolutionLevel: 30, evolutionMethod: 'level' },
			tentacruel: { next: null, evolutionLevel: null, evolutionMethod: null },
			geodude: { next: 'graveler', evolutionLevel: 25, evolutionMethod: 'level' },
			graveler: { next: 'golem', evolutionLevel: null, evolutionMethod: 'trade' },
			golem: { next: null, evolutionLevel: null, evolutionMethod: null },
			ponyta: { next: 'rapidash', evolutionLevel: 40, evolutionMethod: 'level' },
			rapidash: { next: null, evolutionLevel: null, evolutionMethod: null },
			slowpoke: { next: 'slowbro', evolutionLevel: 37, evolutionMethod: 'level' },
			slowbro: { next: null, evolutionLevel: null, evolutionMethod: null },
			magnemite: { next: 'magneton', evolutionLevel: 30, evolutionMethod: 'level' },
			magneton: { next: null, evolutionLevel: null, evolutionMethod: null },
			'mr-mime': { next: null, evolutionLevel: null, evolutionMethod: null },
			farfetchd: { next: null, evolutionLevel: null, evolutionMethod: null },
			doduo: { next: 'dodrio', evolutionLevel: 31, evolutionMethod: 'level' },
			dodrio: { next: null, evolutionLevel: null, evolutionMethod: null },
			seel: { next: 'dewgong', evolutionLevel: 34, evolutionMethod: 'level' },
			dewgong: { next: null, evolutionLevel: null, evolutionMethod: null },
			grimer: { next: 'muk', evolutionLevel: 38, evolutionMethod: 'level' },
			muk: { next: null, evolutionLevel: null, evolutionMethod: null },
			shellder: { next: 'cloyster', evolutionLevel: null, evolutionMethod: 'stone' },
			cloyster: { next: null, evolutionLevel: null, evolutionMethod: null },
			gastly: { next: 'haunter', evolutionLevel: 25, evolutionMethod: 'level' },
			haunter: { next: 'gengar', evolutionLevel: null, evolutionMethod: 'trade' },
			gengar: { next: null, evolutionLevel: null, evolutionMethod: null },
			onix: { next: null, evolutionLevel: null, evolutionMethod: null },
			drowzee: { next: 'hypno', evolutionLevel: 26, evolutionMethod: 'level' },
			hypno: { next: null, evolutionLevel: null, evolutionMethod: null },
			krabby: { next: 'kingler', evolutionLevel: 28, evolutionMethod: 'level' },
			kingler: { next: null, evolutionLevel: null, evolutionMethod: null },
			voltorb: { next: 'electrode', evolutionLevel: 30, evolutionMethod: 'level' },
			electrode: { next: null, evolutionLevel: null, evolutionMethod: null },
			exeggcute: { next: 'exeggutor', evolutionLevel: null, evolutionMethod: 'stone' },
			exeggutor: { next: null, evolutionLevel: null, evolutionMethod: null },
			cubone: { next: 'marowak', evolutionLevel: 28, evolutionMethod: 'level' },
			marowak: { next: null, evolutionLevel: null, evolutionMethod: null },
			hitmonlee: { next: null, evolutionLevel: null, evolutionMethod: null },
			hitmonchan: { next: null, evolutionLevel: null, evolutionMethod: null },
			lickitung: { next: null, evolutionLevel: null, evolutionMethod: null },
			koffing: { next: 'weezing', evolutionLevel: 35, evolutionMethod: 'level' },
			weezing: { next: null, evolutionLevel: null, evolutionMethod: null },
			rhyhorn: { next: 'rhydon', evolutionLevel: 42, evolutionMethod: 'level' },
			rhydon: { next: null, evolutionLevel: null, evolutionMethod: null },
			chansey: { next: null, evolutionLevel: null, evolutionMethod: null },
			tangela: { next: null, evolutionLevel: null, evolutionMethod: null },
			kangaskhan: { next: null, evolutionLevel: null, evolutionMethod: null },
			horsea: { next: 'seadra', evolutionLevel: null, evolutionMethod: 'stone' },
			seadra: { next: null, evolutionLevel: null, evolutionMethod: null },
			goldeen: { next: 'seaking', evolutionLevel: 33, evolutionMethod: 'level' },
			seaking: { next: null, evolutionLevel: null, evolutionMethod: null },
			staryu: { next: 'starmie', evolutionLevel: null, evolutionMethod: 'stone' },
			starmie: { next: null, evolutionLevel: null, evolutionMethod: null },

			scyther: { next: null, evolutionLevel: null, evolutionMethod: null },
			jynx: { next: null, evolutionLevel: null, evolutionMethod: null },
			electabuzz: { next: null, evolutionLevel: null, evolutionMethod: null },
			magmar: { next: null, evolutionLevel: null, evolutionMethod: null },
			pinsir: { next: null, evolutionLevel: null, evolutionMethod: null },
			tauros: { next: null, evolutionLevel: null, evolutionMethod: null },
			magikarp: { next: 'gyarados', evolutionLevel: 20, evolutionMethod: 'level' },
			gyarados: { next: null, evolutionLevel: null, evolutionMethod: null },
			lapras: { next: null, evolutionLevel: null, evolutionMethod: null },
			ditto: { next: null, evolutionLevel: null, evolutionMethod: null },
			eevee: { next: null, evolutionLevel: null, evolutionMethod: null },
			vaporeon: { next: null, evolutionLevel: null, evolutionMethod: null },
			jolteon: { next: null, evolutionLevel: null, evolutionMethod: null },
			flareon: { next: null, evolutionLevel: null, evolutionMethod: null },
			porygon: { next: null, evolutionLevel: null, evolutionMethod: null },
			omanyte: { next: 'omastar', evolutionLevel: 40, evolutionMethod: 'level' },
			omastar: { next: null, evolutionLevel: null, evolutionMethod: null },
			kabuto: { next: 'kabutops', evolutionLevel: 40, evolutionMethod: 'level' },
			kabutops: { next: null, evolutionLevel: null, evolutionMethod: null },
			aerodactyl: { next: null, evolutionLevel: null, evolutionMethod: null },
			snorlax: { next: null, evolutionLevel: null, evolutionMethod: null },
			articuno: { next: null, evolutionLevel: null, evolutionMethod: null },
			zapdos: { next: null, evolutionLevel: null, evolutionMethod: null },
			moltres: { next: null, evolutionLevel: null, evolutionMethod: null },
			dratini: { next: 'dragonair', evolutionLevel: 30, evolutionMethod: 'level' },
			dragonair: { next: 'dragonite', evolutionLevel: 55, evolutionMethod: 'level' },
			dragonite: { next: null, evolutionLevel: null, evolutionMethod: null },
			mewtwo: { next: null, evolutionLevel: null, evolutionMethod: null },
			mew: { next: null, evolutionLevel: null, evolutionMethod: null },
			pikachu: { next: 'raichu', evolutionLevel: null, evolutionMethod: 'stone' },
			raichu: { next: null, evolutionLevel: null, evolutionMethod: null }
		};
		const rarityData = {
			COMMON: { id: 'COMMON', name: '일반', displayName: '⚪ 일반', catchStreakRequired: 2, minimumLevel: 5, baseEncounterWeight: 70 },
			UNCOMMON: { id: 'UNCOMMON', name: '고급', displayName: '🟢 고급', catchStreakRequired: 3, minimumLevel: 10, baseEncounterWeight: 23 },
			RARE: { id: 'RARE', name: '희귀', displayName: '🔵 희귀', catchStreakRequired: 5, minimumLevel: 20, baseEncounterWeight: 7 },
			EPIC: { id: 'EPIC', name: '특급 희귀', displayName: '🟣 특급 희귀', catchStreakRequired: 7, minimumLevel: 35, baseEncounterWeight: 3 },
			LEGENDARY: { id: 'LEGENDARY', name: '전설', displayName: '🟡 전설', catchStreakRequired: 10, minimumLevel: 50, baseEncounterWeight: 1 }
		};
		const wildPokemonData = [
			{ speciesId: 'rattata', name: '꼬렛', emoji: '🐭' },
			{ speciesId: 'pidgey', name: '구구', emoji: '🐦' },
			{ speciesId: 'pikachu', name: '피카츄', emoji: '⚡' },
			{ speciesId: 'dratini', name: '미뇽', emoji: '🐉' },
			{ speciesId: 'snorlax', name: '잠만보', emoji: '😴' },
			{ speciesId: 'articuno', name: '프리져', emoji: '🪽' },
			{ speciesId: 'mew', name: '뮤', emoji: '✨' }
		];
		const gen1Names = '이상해씨,이상해풀,이상해꽃,파이리,리자드,리자몽,꼬부기,어니부기,거북왕,캐터피,단데기,버터플,뿔충이,딱충이,독침붕,구구,피죤,피죤투,꼬렛,다꼬리,깨비참,깨비드릴조,아보,아보크,피카츄,라이츄,모래두지,고지,니드런♀,니드리나,니드퀸,니드런♂,니드리노,니드킹,삐삐,픽시,식스테일,나인테일,푸린,푸크린,주뱃,골뱃,뚜벅쵸,냄새꼬,라플레시아,파라스,파라섹트,콘팡,도나리,디그다,닥트리오,나옹,페르시온,고라파덕,골덕,망키,성원숭,가디,윈디,발챙이,슈륙챙이,강챙이,캐이시,윤겔라,후딘,알통몬,근육몬,괴력몬,모다피,우츠동,우츠보트,왕눈해,독파리,꼬마돌,데구리,딱구리,포니타,날쌩마,야돈,야도란,코일,레어코일,파오리,두두,두트리오,쥬쥬,쥬레곤,질퍽이,질뻐기,셀러,파르셀,고오스,고우스트,팬텀,롱스톤,슬리프,슬리퍼,크랩,킹크랩,찌리리공,붐볼,아라리,나시,탕구리,텅구리,시라소몬,홍수몬,내루미,또가스,또도가스,뿔카노,코뿌리,럭키,덩쿠리,캥카,쏘드라,시드라,콘치,왕콘치,별가사리,아쿠스타,마임맨,스라크,루주라,에레브,마그마,쁘사이저,켄타로스,잉어킹,갸라도스,라프라스,메타몽,이브이,샤미드,쥬피썬더,부스터,폴리곤,암나이트,암스타,투구,투구푸스,프테라,잠만보,프리져,썬더,파이어,미뇽,신뇽,망나뇽,뮤츠,뮤'.split(',');
		const gen1Ids = 'bulbasaur,ivysaur,venusaur,charmander,charmeleon,charizard,squirtle,wartortle,blastoise,caterpie,metapod,butterfree,weedle,kakuna,beedrill,pidgey,pidgeotto,pidgeot,rattata,raticate,spearow,fearow,ekans,arbok,pikachu,raichu,sandshrew,sandslash,nidoran-f,nidorina,nidoqueen,nidoran-m,nidorino,nidoking,clefairy,clefable,vulpix,ninetales,jigglypuff,wigglytuff,zubat,golbat,oddish,gloom,vileplume,paras,parasect,venonat,venomoth,diglett,dugtrio,meowth,persian,psyduck,golduck,mankey,primeape,growlithe,arcanine,poliwag,poliwhirl,poliwrath,abra,kadabra,alakazam,machop,machoke,machamp,bellsprout,weepinbell,victreebel,tentacool,tentacruel,geodude,graveler,golem,ponyta,rapidash,slowpoke,slowbro,magnemite,magneton,farfetchd,doduo,dodrio,seel,dewgong,grimer,muk,shellder,cloyster,gastly,haunter,gengar,onix,drowzee,hypno,krabby,kingler,voltorb,electrode,exeggcute,exeggutor,cubone,marowak,hitmonlee,hitmonchan,lickitung,koffing,weezing,rhyhorn,rhydon,chansey,tangela,kangaskhan,horsea,seadra,goldeen,seaking,staryu,starmie,mr-mime,scyther,jynx,electabuzz,magmar,pinsir,tauros,magikarp,gyarados,lapras,ditto,eevee,vaporeon,jolteon,flareon,porygon,omanyte,omastar,kabuto,kabutops,aerodactyl,snorlax,articuno,zapdos,moltres,dratini,dragonair,dragonite,mewtwo,mew'.split(',');
		const gen1Types = '풀/독,풀/독,풀/독,불꽃,불꽃,불꽃,물,물,물,벌레,벌레,벌레/비행,벌레/독,벌레/독,벌레/독,노말/비행,노말/비행,노말/비행,노말,노말,노말/비행,노말/비행,독,독,전기,전기,땅,땅,독,독,독,독,독,독,페어리,페어리,불꽃,불꽃,노말,노말,독/비행,독/비행,풀/독,풀/독,풀/독,벌레,벌레,벌레,벌레/독,벌레/독,땅,땅,노말,노말,물,물,격투,격투,불꽃,불꽃,물,물,물/격투,에스퍼,에스퍼,에스퍼,격투,격투,격투,풀/독,풀/독,풀/독,물/독,물/독,바위/땅,바위/땅,바위/땅,불꽃,불꽃,물/에스퍼,물/에스퍼,전기/강철,전기/강철,노말/비행,노말/비행,노말/비행,물,물/얼음,독,독,물,물/얼음,고스트/독,고스트/독,고스트/독,바위/땅,에스퍼,에스퍼,물,물,전기,전기,풀/에스퍼,풀/에스퍼,땅,땅,격투,격투,노말,독,독,땅/바위,땅/바위,노말,풀,노말,물,물,물,물,물/에스퍼,벌레/비행,얼음/에스퍼,전기,불꽃,벌레,노말,물,물/비행,노말,노말,노말,물,전기,불꽃,노말,바위/물,바위/물,바위,바위,바위/비행,노말,얼음/비행,전기/비행,불꽃/비행,드래곤,드래곤,드래곤/비행,에스퍼,에스퍼'.split(',');
		gen1Types.push('에스퍼');
		const gen1RarityBySpecies = Object.fromEntries([
			['COMMON', 'caterpie,weedle,pidgey,rattata,spearow,nidoran-f,nidoran-m,zubat,oddish,bellsprout,tentacool,geodude,goldeen,magikarp'],
			['UNCOMMON', 'metapod,butterfree,kakuna,beedrill,pidgeotto,raticate,fearow,ekans,sandshrew,nidorina,nidorino,vulpix,jigglypuff,golbat,gloom,paras,venonat,diglett,meowth,psyduck,mankey,growlithe,poliwag,machop,weepinbell,tentacruel,graveler,ponyta,slowpoke,magnemite,doduo,seel,grimer,shellder,gastly,drowzee,krabby,voltorb,koffing,rhyhorn,horsea,seaking,staryu'],
			['RARE', 'bulbasaur,charmander,squirtle,pidgeot,arbok,pikachu,sandslash,nidoqueen,nidoking,clefairy,ninetales,wigglytuff,vileplume,parasect,venomoth,dugtrio,persian,golduck,primeape,arcanine,poliwhirl,abra,victreebel,rapidash,slowbro,magneton,farfetchd,dodrio,dewgong,muk,cloyster,haunter,onix,hypno,kingler,electrode,exeggcute,cubone,marowak,hitmonlee,hitmonchan,weezing,rhydon,tangela,seadra,starmie,mr-mime,jynx,ditto,eevee'],
			['EPIC', 'ivysaur,venusaur,charmeleon,charizard,wartortle,blastoise,raichu,clefable,poliwrath,kadabra,alakazam,machoke,machamp,golem,gengar,exeggutor,lickitung,chansey,kangaskhan,scyther,electabuzz,magmar,pinsir,tauros,gyarados,lapras,vaporeon,jolteon,flareon,porygon,omanyte,omastar,kabuto,kabutops,aerodactyl,snorlax,dratini,dragonair,dragonite'],
			['LEGENDARY', 'articuno,zapdos,moltres,mewtwo,mew']
		].flatMap(([rarity, speciesIds]) => speciesIds.split(',').map((speciesId) => [speciesId, rarity])));
		const gen1PokemonData = gen1Ids.map((speciesId, index) => ({ dexNumber: index + 1, speciesId, name: gen1Names[index], type: `${gen1Types[index]} 타입`, rarity: gen1RarityBySpecies[speciesId], emoji: starterPokemonData[speciesId]?.emoji || wildPokemonData.find((pokemon) => pokemon.speciesId === speciesId)?.emoji || '🐾' }));
		Object.assign(pokemonImageData, Object.fromEntries(gen1PokemonData.map((pokemon) => [pokemon.speciesId, { image: `assets/pokemon/${String(pokemon.dexNumber).padStart(3, '0')}-${pokemon.speciesId}.png` }])));
		const gen1EvolutionData = {
			bulbasaur: ['ivysaur'], ivysaur: ['venusaur'], charmander: ['charmeleon'], charmeleon: ['charizard'], squirtle: ['wartortle'], wartortle: ['blastoise'], caterpie: ['metapod'], metapod: ['butterfree'], weedle: ['kakuna'], kakuna: ['beedrill'], pidgey: ['pidgeotto'], pidgeotto: ['pidgeot'], rattata: ['raticate'], spearow: ['fearow'], ekans: ['arbok'], sandshrew: ['sandslash'], 'nidoran-f': ['nidorina'], nidorina: ['nidoqueen'], 'nidoran-m': ['nidorino'], nidorino: ['nidoking'], clefairy: ['clefable'], vulpix: ['ninetales'], jigglypuff: ['wigglytuff'], zubat: ['golbat'], oddish: ['gloom'], gloom: ['vileplume'], paras: ['parasect'], venonat: ['venomoth'], diglett: ['dugtrio'], meowth: ['persian'], psyduck: ['golduck'], mankey: ['primeape'], growlithe: ['arcanine'], poliwag: ['poliwhirl'], poliwhirl: ['poliwrath'], abra: ['kadabra'], kadabra: ['alakazam'], machop: ['machoke'], machoke: ['machamp'], bellsprout: ['weepinbell'], weepinbell: ['victreebel'], tentacool: ['tentacruel'], geodude: ['graveler'], graveler: ['golem'], ponyta: ['rapidash'], slowpoke: ['slowbro'], magnemite: ['magneton'], doduo: ['dodrio'], seel: ['dewgong'], grimer: ['muk'], shellder: ['cloyster'], gastly: ['haunter'], haunter: ['gengar'], drowzee: ['hypno'], krabby: ['kingler'], voltorb: ['electrode'], exeggcute: ['exeggutor'], cubone: ['marowak'], rhyhorn: ['rhydon'], horsea: ['seadra'], goldeen: ['seaking'], staryu: ['starmie'], eevee: ['vaporeon', 'jolteon', 'flareon'], omanyte: ['omastar'], kabuto: ['kabutops'], dratini: ['dragonair'], dragonair: ['dragonite']
		};
		const gen1PokemonById = Object.fromEntries(gen1PokemonData.map((pokemon) => [pokemon.speciesId, pokemon]));
		wildPokemonData.forEach((pokemon) => Object.assign(pokemon, { type: gen1PokemonById[pokemon.speciesId]?.type, rarity: gen1PokemonById[pokemon.speciesId]?.rarity, minimumLevel: rarityData[gen1PokemonById[pokemon.speciesId]?.rarity]?.minimumLevel }));
		wildPokemonData.push(...gen1PokemonData.filter((pokemon) => !wildPokemonData.some((wildPokemon) => wildPokemon.speciesId === pokemon.speciesId)).map((pokemon) => ({ ...pokemon, minimumLevel: rarityData[pokemon.rarity].minimumLevel })));
		Object.assign(dexSpeciesData, Object.fromEntries(gen1PokemonData.map((pokemon) => [pokemon.speciesId, { number: String(pokemon.dexNumber).padStart(3, '0'), rarity: pokemon.rarity }])));
		function testRaritySystem() {
			const validRarities = Object.keys(rarityData);
			const speciesIds = gen1PokemonData.map((pokemon) => pokemon.speciesId);
			const missingRarities = gen1PokemonData.filter((pokemon) => !pokemon.rarity).map((pokemon) => pokemon.speciesId);
			const invalidRarities = gen1PokemonData.filter((pokemon) => !validRarities.includes(pokemon.rarity)).map((pokemon) => pokemon.speciesId);
			const duplicateSpecies = speciesIds.filter((speciesId, index) => speciesIds.indexOf(speciesId) !== index);
			const requiredRarities = { articuno: 'LEGENDARY', zapdos: 'LEGENDARY', moltres: 'LEGENDARY', mewtwo: 'LEGENDARY', mew: 'LEGENDARY', pikachu: 'RARE', eevee: 'RARE', snorlax: 'EPIC', dratini: 'EPIC', dragonite: 'EPIC' };
			const requiredMatches = Object.entries(requiredRarities).every(([speciesId, rarity]) => gen1PokemonById[speciesId]?.rarity === rarity);
			return { total: gen1PokemonData.length, allDexNumbersPresent: gen1PokemonData.every((pokemon, index) => pokemon.dexNumber === index + 1), missingRarities, invalidRarities, duplicateSpecies, requiredMatches, wildCandidatesComplete: wildPokemonData.length === 151 && wildPokemonData.every((pokemon) => validRarities.includes(pokemon.rarity)), pass: gen1PokemonData.length === 151 && missingRarities.length === 0 && invalidRarities.length === 0 && duplicateSpecies.length === 0 && requiredMatches };
		}
		