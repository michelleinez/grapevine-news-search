#!/bin/bash
base_socks_port=9050
base_control_port=15000
country_codes=("{be}" "{pl}" "{ca}" "{za}" "{vn}" "{uz}" "{ua}" "{tw}" "{tr}" "{th}" "{sk}" "{sg}" "{se}" "{sd}" "{sa}" "{ru}" "{ro}" "{pt}" "{ph}" "{pa}" "{nz}" "{np}" "{no}" "{my}" "{mx}" "{md}" "{lv}" "{lu}" "{kr}" "{jp}" "{it}" "{ir}" "{il}" "{ie}" "{id}" "{hr}" "{hk}" "{gr}" "{gi}" "{gb}" "{fi}" "{es}" "{ee}" "{dk}" "{cz}" "{cy}" "{cr}" "{co}" "{cn}" "{cl}" "{ci}" "{ch}" "{by}" "{br}" "{bg}" "{au}" "{at}" "{ar}" "{aq}" "{ao}" "{ae}" "{nl}" "{de}" "{fr}")
echo ${country_codes[@]}
echo ${#country_codes[@]}

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
	mkdir "data"
fi

for i in $(seq ${#country_codes[@]})
do
	j=$((i+1))
	socks_port=$((base_socks_port+i))
	control_port=$((base_control_port+i))
	if [ ! -d "data/tor$i" ]; then
		echo "Creating directory data/tor$i"
		mkdir "data/tor$i"
	fi

	# Take into account that authentication for the control port is disabled. Must be used in secure and controlled environments
	echo "Running: tor --RunAsDaemon 1 --CookieAuthentication 0 --HashedControlPassword \"\" --ControlPort $control_port --PidFile tor$i.pid --SocksPort $socks_port --DataDirectory data/tor$i --ExitNodes ${country_codes[j]}"

	tor --RunAsDaemon 1 --CookieAuthentication 0 --HashedControlPassword "" --ControlPort $control_port --PidFile tor$i.pid --SocksPort $socks_port --DataDirectory data/tor$i --ExitNodes ${country_codes[j]}
done
