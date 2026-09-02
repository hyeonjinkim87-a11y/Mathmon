# ============================================================
# MathPokemon - Generation 1 Pokemon Image Downloader
# PokéAPI Sprites - HOME 512x512 PNG
#
# Downloads Pokemon #001 ~ #151
# Existing 17 Pokemon are skipped.
# ============================================================

$ErrorActionPreference = "Stop"

# ------------------------------------------------------------
# Project / image folder
# ------------------------------------------------------------

$targetDir = Join-Path $PSScriptRoot "assets\pokemon"

New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

$baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home"

# ------------------------------------------------------------
# Generation 1 Pokemon names
# National Dex #001 ~ #151
# ------------------------------------------------------------

$pokemonNames = @(
    "bulbasaur",
    "ivysaur",
    "venusaur",
    "charmander",
    "charmeleon",
    "charizard",
    "squirtle",
    "wartortle",
    "blastoise",
    "caterpie",
    "metapod",
    "butterfree",
    "weedle",
    "kakuna",
    "beedrill",
    "pidgey",
    "pidgeotto",
    "pidgeot",
    "rattata",
    "raticate",
    "spearow",
    "fearow",
    "ekans",
    "arbok",
    "pikachu",
    "raichu",
    "sandshrew",
    "sandslash",
    "nidoran-f",
    "nidorina",
    "nidoqueen",
    "nidoran-m",
    "nidorino",
    "nidoking",
    "clefairy",
    "clefable",
    "vulpix",
    "ninetales",
    "jigglypuff",
    "wigglytuff",
    "zubat",
    "golbat",
    "oddish",
    "gloom",
    "vileplume",
    "paras",
    "parasect",
    "venonat",
    "venomoth",
    "diglett",
    "dugtrio",
    "meowth",
    "persian",
    "psyduck",
    "golduck",
    "mankey",
    "primeape",
    "growlithe",
    "arcanine",
    "poliwag",
    "poliwhirl",
    "poliwrath",
    "abra",
    "kadabra",
    "alakazam",
    "machop",
    "machoke",
    "machamp",
    "bellsprout",
    "weepinbell",
    "victreebel",
    "tentacool",
    "tentacruel",
    "geodude",
    "graveler",
    "golem",
    "ponyta",
    "rapidash",
    "slowpoke",
    "slowbro",
    "magnemite",
    "magneton",
    "farfetchd",
    "doduo",
    "dodrio",
    "seel",
    "dewgong",
    "grimer",
    "muk",
    "shellder",
    "cloyster",
    "gastly",
    "haunter",
    "gengar",
    "onix",
    "drowzee",
    "hypno",
    "krabby",
    "kingler",
    "voltorb",
    "electrode",
    "exeggcute",
    "exeggutor",
    "cubone",
    "marowak",
    "hitmonlee",
    "hitmonchan",
    "lickitung",
    "koffing",
    "weezing",
    "rhyhorn",
    "rhydon",
    "chansey",
    "tangela",
    "kangaskhan",
    "horsea",
    "seadra",
    "goldeen",
    "seaking",
    "staryu",
    "starmie",
    "mr-mime",
    "scyther",
    "jynx",
    "electabuzz",
    "magmar",
    "pinsir",
    "tauros",
    "magikarp",
    "gyarados",
    "lapras",
    "ditto",
    "eevee",
    "vaporeon",
    "jolteon",
    "flareon",
    "porygon",
    "omanyte",
    "omastar",
    "kabuto",
    "kabutops",
    "aerodactyl",
    "snorlax",
    "articuno",
    "zapdos",
    "moltres",
    "dratini",
    "dragonair",
    "dragonite",
    "mewtwo",
    "mew"
)

# ------------------------------------------------------------
# Existing 17 Pokemon
#
# These have already been downloaded with custom filenames.
# DO NOT download them again.
# ------------------------------------------------------------

$existingPokemon = @{
    1   = "004-bulbasaur.png"
    2   = "005-ivysaur.png"
    3   = "006-venusaur.png"

    4   = "001-charmander.png"
    5   = "002-charmeleon.png"
    6   = "003-charizard.png"

    7   = "007-squirtle.png"
    8   = "008-wartortle.png"
    9   = "009-blastoise.png"

    16  = "012-pidgey.png"
    19  = "013-rattata.png"

    25  = "010-pikachu.png"
    26  = "011-raichu.png"

    143 = "015-snorlax.png"
    144 = "016-articuno.png"

    147 = "014-dratini.png"
    151 = "017-mew.png"
}

# ------------------------------------------------------------
# Counters
# ------------------------------------------------------------

$total = 151
$existingCount = 0
$downloadedCount = 0
$failedCount = 0

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " MathPokemon - Gen 1 Pokemon Image Downloader" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target folder:"
Write-Host $targetDir
Write-Host ""
Write-Host "Total Pokemon: $total"
Write-Host "Already downloaded: 17"
Write-Host "To download: 134"
Write-Host ""

# ------------------------------------------------------------
# Validate Pokemon list
# ------------------------------------------------------------

if ($pokemonNames.Count -ne 151) {
    Write-Host "ERROR: Pokemon list contains $($pokemonNames.Count) entries instead of 151." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------
# Download
# ------------------------------------------------------------

for ($id = 1; $id -le 151; $id++) {

    $name = $pokemonNames[$id - 1]
    $number = "{0:D3}" -f $id

    # --------------------------------------------------------
    # Existing Pokemon
    # --------------------------------------------------------

    if ($existingPokemon.ContainsKey($id)) {

        $existingFile = $existingPokemon[$id]

        Write-Host "[EXISTS]   #$number $name -> $existingFile" -ForegroundColor Green

        $existingCount++

        continue
    }

    # --------------------------------------------------------
    # New Pokemon
    # --------------------------------------------------------

    $fileName = "$number-$name.png"
    $outputPath = Join-Path $targetDir $fileName

    $url = "$baseUrl/$id.png"

    # If a file with the new standard name already exists,
    # don't download it again.
    if (Test-Path $outputPath) {

        Write-Host "[EXISTS]   #$number $name -> $fileName" -ForegroundColor Green

        $existingCount++

        continue
    }

    Write-Host "[DOWNLOAD] #$number $name" -ForegroundColor Cyan

    try {

        Invoke-WebRequest `
            -Uri $url `
            -OutFile $outputPath `
            -UseBasicParsing

        # Basic file validation
        if ((Test-Path $outputPath) -and ((Get-Item $outputPath).Length -gt 1000)) {

            Write-Host "           OK -> $fileName" -ForegroundColor Green

            $downloadedCount++
        }
        else {

            Write-Host "           FAILED: downloaded file appears invalid." -ForegroundColor Red

            if (Test-Path $outputPath) {
                Remove-Item $outputPath -Force
            }

            $failedCount++
        }

    }
    catch {

        Write-Host "           FAILED: $($_.Exception.Message)" -ForegroundColor Red

        if (Test-Path $outputPath) {
            Remove-Item $outputPath -Force
        }

        $failedCount++
    }

    # Small delay to avoid excessive requests
    Start-Sleep -Milliseconds 150
}

# ------------------------------------------------------------
# Final verification
# ------------------------------------------------------------

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " Download Complete" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Total Pokemon       : $total"
Write-Host "Already existed     : $existingCount"
Write-Host "Downloaded now      : $downloadedCount"
Write-Host "Failed              : $failedCount"

Write-Host ""

# Count actual PNG files
$pngFiles = Get-ChildItem -Path $targetDir -Filter "*.png" -File

Write-Host "PNG files in folder : $($pngFiles.Count)"

Write-Host ""

if ($failedCount -eq 0) {

    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "All 151 Generation 1 Pokemon images are ready." -ForegroundColor Green

}
else {

    Write-Host "WARNING!" -ForegroundColor Yellow
    Write-Host "$failedCount image(s) failed to download." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Image folder:"
Write-Host $targetDir
Write-Host ""