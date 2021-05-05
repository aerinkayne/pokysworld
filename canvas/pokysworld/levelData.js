export const width = 600; 
export const height = 400;  //for canvas proportions

export const levelData = [

	{//0
	levelMap: [
		"00 00 00 00 00 00 00 00 00 00 00 00 CL CM CM CM CM CM CM CR 00 00 00 00 00 00 00 00 00 CL CM CM CM CM CM CM CM CM ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"g1 00 00 00 00 00 00 00 00 00 d2 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"d2 d4 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"d1 d2 d1 d3 00 00 d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 CL CM CM CR 00 CL CR cm 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 d1 d2 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 Vt 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 d4 d2 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 01 00 00 g1 0h 00 00 00 00 00 cl g1 g1 cl 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 g1 g1 g1 d2 d1 d4 0H 0H 0H 0H d3 d1 d1 d1 d1 d1 d4 d2 d3 d1 d2 d4 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 d1 d2 d1 d3 d2 d1 d3 d1 d2 d1 d2 d3 d1 d2 d3 d1 d3 d2 d2 d3 d1 d2 d3 d1 d2 ",
		"00 00 00 00 00 00 00 00 Vt 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 d3 d1 d2 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 0m 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 d1 d2 d1 d3 d1 d1 d2 d2 d1 0W 0W 0W 0W 0W 0W 0W 0W 0W 0W i1 i1 0W 0W i1 i1 i1 i1 i1 i1 i1 i1 ",
		"d1 0L 0L d2 d1 0L 0L d2 d1 d3 d1 d3 d1 d1 d1 d1 0w 0w 0w 0w 0w 0w 0w 0w 0w 0w i3 i3 0w 0w i3 i3 i3 i3 i3 i3 i3 i3 "
		],
	//images assigned in preload.  properties refer to image, translation rate relative to player translation, and intitial P.y location of image.
	levelBackgroundImages: [{img:null, rate:0, Y: 0},  //175
							{img:null, rate:0.05,  Y: 160},
							{img:null, rate:0.65,  Y: -100}], 
	skyStart: [120,170,255],
	skyEnd: [250,95,40],
	levelMusic: null,  //assign in preload
	levelEffects: ["rain"], 
	//indices of numBGeffects and levelEffect correlate.
	numBGEffects: [125], // 20],
	numFGEffects: [15]   //, 5]
	},
	
	//************************************************************************************************************

	{ //1
	levelMap: [
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 "
		],
	levelBackgroundImages: [{img:null, rate:0.05, Y: 175},  
							{img:null, rate:0.1,  Y: 0},
							{img:null, rate:0.35,  Y: 230}], 
	skyStart: [120,170,255],
	skyEnd: [250,95,40],
	levelMusic: null,  //assign in preload
	levelEffects: ["snow"], 
	numBGEffects: [125], 
	numFGEffects: [15]   
	}
]