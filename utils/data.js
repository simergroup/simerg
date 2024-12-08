// INITIATIVES IMAGES
import postGraduation from "../public/Initiatives/initiativesimage.png";
// TEAM IMAGES
import asantos from "../public/Team/asantos.png";
import tribeiro from "../public/Team/tribeiro.png";
import acalapez from "../public/Team/acalapez.png";
import lcerqueira from "../public/Team/lcerqueira.jpg";
import iviegas from "../public/Team/iviegas.png";
import brodrigues from "../public/Team/brodrigues.png";
import vprincipe from "../public/Team/vprincipe.png";
// PROJECTS IMAGES
import volta from "../public/Projects/research/daravolta.png";
import geforce from "../public/Projects/research/geforce.png";
import semasc from "../public/Projects/research/semasc.png";
import sopros from "../public/Projects/research/sopros.png";
// PARTNERS IMAGES
import fpde from "../public/Partners/fpde-logo.png";
import bhout from "../public/Partners/bhout.png";
// NEWS IMAGES
import semascNews1 from "../public/News/semasc-news-1.jpg";
import semascNews2 from "../public/News/semasc-news-2.jpg";

function createSlug(title) {
	const specialChars = {
		à: "a",
		á: "a",
		â: "a",
		ã: "a",
		ä: "a",
		å: "a",
		è: "e",
		é: "e",
		ê: "e",
		ë: "e",
		ì: "i",
		í: "i",
		î: "i",
		ï: "i",
		ò: "o",
		ó: "o",
		ô: "o",
		õ: "o",
		ö: "o",
		ù: "u",
		ú: "u",
		û: "u",
		ü: "u",
		ñ: "n",
		ç: "c",
		ß: "ss",
		æ: "ae",
		œ: "oe",
	};

	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, (char) => specialChars[char] || "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim()
		.replace(/^-+|-+$/g, "");
}

export const MASTER_PROJECTS = [
	{
		id: 0,
		title:
			"Esports fan identity with the event and the sponsoring brand: A case study of LG at the FPF Open Challenge.",
		description:
			"This study aims to explore the eSports fans’ identity on sponsor-sponsee relationship, as well as understand the effects on their behavioural intentions. Data were collected among Portuguese eSports fans (n = 356) who attended at the 2021 FPF Open Challenge, using an online questionnaire. A confirmatory factor analysis (CFA) analysed the psychometric properties of the constructs, and a subsequent structural equation model (SEM) examined the effects of fan identity on two behavioural intention and on sponsor-sponsee relationship. Results evidence that highly identified fans with eSports are more committed towards the event and tend to have a positive word-of-mouth intention, while those who have higher brand identification reported the highest connection to the event sponsor-brand and then tend to purchase its products. Moreover, our findings also provide evidence of the bidirectional interaction between fan’ identity with eSports event and its sponsor-brand, leading to greater reciprocity on their social identity formation. Managerial implications focus on strengthening the social identity of fans as a way to understand their future behaviours.",
		paragraph1:
			"This study aims to explore the eSports fans’ identity on sponsor-sponsee relationship, as well as understand the effects on their behavioural intentions.",
		paragraph2:
			"Data were collected among Portuguese eSports fans (n = 356) who attended at the 2021 FPF Open Challenge, using an online questionnaire. A confirmatory factor analysis (CFA) analysed the psychometric properties of the constructs, and a subsequent structural equation model (SEM) examined the effects of fan identity on two behavioural intention and on sponsor-sponsee relationship.",
		paragraph3:
			"Results evidence that highly identified fans with eSports are more committed towards the event and tend to have a positive word-of-mouth intention, while those who have higher brand identification reported the highest connection to the event sponsor-brand and then tend to purchase its products.",
		paragraph4:
			"Moreover, our findings also provide evidence of the bidirectional interaction between fan’ identity with eSports event and its sponsor-brand, leading to greater reciprocity on their social identity formation. Managerial implications focus on strengthening the social identity of fans as a way to understand their future behaviours.",
		year: 2022,
		keywords: "Fan Identity; Sponsorship; Consumption; Esports; Events;",
		author: "André Calapez",
		professorAdvisor: "Tiago Ribeiro",
		slug: createSlug(
			"Esports fan identity with the event and the sponsoring brand: A case study of LG at the FPF Open Challenge."
		),
	},
	{
		id: 1,
		title:
			"Physical environment in esports events: The influence in affective responses and behavioural intentions of spectators.",
		desription:
			"This study aims (a) to understand the spectators’ perceptions on the constructs of physical environment of an eSports event and, (b) to research its impact on the spectators’ affective responses and behavioural intentions. Data collection was carried out at Lisboa Games Week event (n=328), by using a self administered questionnaire. The instrument analyses 7 dimensions atmosphere, equipments, facility design, accessibility, affec tive responses, revisit intentions and positive word of mouth. A confirmatory factor analysis (CFA), and a following structural equation model (SEM), were used to determine the viability of the conceptual model. The results show that the quality of the physical environment dimensions, holds influence over the affective responses, revisit intention and positive word of mouth of the event spectators. Exception made on the equipment’s dimension, which did not have a relevant impact over the spectators’ emotion s and behavioral intentions. Furthermore, the accessibility dimension, as an antecedent of the spectator affective responses and behavioral intentions, should be included in future models. The practical implications of this study propose the improvement of the physical environment dimensions, so that a consequent impact on affective responses, leads to a retain spectators on a future edition of an eSports event.",
		paragraph1:
			"This study aims (a) to understand the spectators’ perceptions on the constructs of physical environment of an eSports event and, (b) to research its impact on the spectators’ affective responses and behavioural intentions.",
		paragraph2:
			"Data collection was carried out at Lisboa Games Week event (n=328), by using a self administered questionnaire. The instrument analyses 7 dimensions atmosphere, equipments, facility design, accessibility, affec tive responses, revisit intentions and positive word of mouth. A confirmatory factor analysis (CFA), and a following structural equation model (SEM), were used to determine the viability of the conceptual model.",
		paragraph3:
			"The results show that the quality of the physical environment dimensions, holds influence over the affective responses, revisit intention and positive word of mouth of the event spectators. Exception made on the equipment’s dimension, which did not have a relevant impact over the spectators’ emotion s and behavioural intentions.",
		paragraph4:
			"Furthermore, the accessibility dimension, as an antecedent of the spectator affective responses and behavioral intentions, should be included in future models. The practical implications of this study propose the improvement of the physical environment dimensions, so that a consequent impact on affective responses, leads to a retain spectators on a future edition of an eSports event.",
		keywords: "Physical Environment; Affective Responses; Consumption; Esports; Events;",
		year: 2023,
		author: "Luís Cerqueira",
		professorAdvisor: "Tiago Ribeiro",
		slug: createSlug(
			"Physical environment in esports events: The influence in affective responses and behavioural intentions of spectators."
		),
	},
	{
		id: 2,
		title:
			"The social identity of esports fans and their behavioural intentions: A case study on Diogo Jota, Diogo Jota Esports and Adidas",
		description:
			"Electronic sports (esports) have become more popular throughout the years and have attracted more viewers than traditional sports, allowing new research about fans. This study aims to explore the fans’ identity with Diogo Jota and his esports team, and its effect on their future behavioural intentions towards the sponsor brand. Data were collected among Diogo Jota’s fans (n = 412) through an online questionnaire. Descriptive statistics were calculated using SPSS 26.0 and then the data were analyzed using AMOS 26.0. A Confirmatory Factor Analysis (CFA) was also conducted on the model proposed to ensure the measurement model’s psychometric properties. Results revealed that fans’ identity with Diogo Jota had a significant positive effect on their identity with the esports team, and team identity showed a positive and significant predictor of their behavioral intentions towards the sponsor brand. Findings also suggest that the effects of fans’ identity with Diogo Jota on brand word-of-mouth and brand purchase intention are positive and significant in the presence of the mediating variable – team identity. Due to the lower score of team identity, managerial implications address the need to explore and reinforce the social role of the fan’s identity with Diogo Jota's esports team.",
		paragraph1:
			"Electronic sports (esports) have become more popular throughout the years and have attracted more viewers than traditional sports, allowing new research about fans. This study aims to explore the fans’ identity with Diogo Jota and his esports team, and its effect on their future behavioural intentions towards the sponsor brand.",
		paragraph2:
			"Data were collected among Diogo Jota’s fans (n = 412) through an online questionnaire. Descriptive statistics were calculated using SPSS 26.0 and then the data were analyzed using AMOS 26.0. A Confirmatory Factor Analysis (CFA) was also conducted on the model proposed to ensure the measurement model’s psychometric properties.",
		paragraph3:
			"Results revealed that fans’ identity with Diogo Jota had a significant positive effect on their identity with the esports team, and team identity showed a positive and significant predictor of their behavioural intentions towards the sponsor brand. Findings also suggest that the effects of fans’ identity with Diogo Jota on brand word-of-mouth and brand purchase intention are positive and significant in the presence of the mediating variable – team identity.",
		paragraph4:
			"Due to the lower score of team identity, managerial implications address the need to explore and reinforce the social role of the fan’s identity with Diogo Jota's esports team.",
		keywords: "Social Identity; Influencers; Consumption; Esports; Sponsorship;",
		year: 2023,
		author: "Shaina Mohamed",
		professorAdvisor: "Tiago Ribeiro",
		slug: createSlug(
			"The social identity of esports fans and their behavioural intentions: A case study on Diogo Jota, Diogo Jota Esports and Adidas"
		),
	},
];

export const RESEARCH_PROJECTS = [
	{
		id: 0,
		title: "Dar A Volta",
		description:
			"An ethnographic project, lead by Group Coordinator Ana Santos, that looked to examine the role of bikes in mobility through the revisitation of the first Volta a Portugal (Portugal's number one Cycling Competition). The 1927 Volta was a competition shaped by feelings of identity and, therefore, easily recognized by the social imaginary. The project seeks to understand the contemporary dynamics of bicycle usage and the challenges posed by the interaction of social, physical, and virtual spaces.",
		paragraph1:
			"An ethnographic project, lead by Group Coordinator Ana Santos, that looked to examine the role of bikes in mobility through the revisitation of the first Volta a Portugal (Portugal's number one Cycling Competition).",
		paragraph2:
			"The 1927 Volta was a competition shaped by feelings of identity and, therefore, easily recognized by the social imaginary. The project seeks to understand the contemporary dynamics of bicycle usage and the challenges posed by the interaction of social, physical, and virtual spaces.",
		keywords: "Cycling; Ethnography; Volta a Portugal; Urban, Social and Virtual Spaces;",
		author: "Ana Santos",
		website: "https://daravolta.fmh.ulisboa.pt/",
		book: "https://www.wook.pt/livro/volta-a-portugal-em-bicicleta-ana-santos/11257658",
		image: volta,
		slug: createSlug("Dar A Volta"),
	},
	{
		id: 1,
		title: "GE FORCE - Gender Equality Force",
		description:
			"GE FORCE endeavors to empower sports organizations to achieve gender balance within their leadership ranks. Through raising awareness, offering guidance, and extending support to emerging leaders in sports, we aim to facilitate their involvement in fostering the essential change needed to promote diversity and inclusion. Our research culminated in the production of three pivotal documents: a comprehensive systematic review report, a meticulously documented analysis report, and a best-practices report. These resources are made accessible to all, enabling sports organizations worldwide to enhance their efforts and advance gender equality on a global scale.",
		paragraph1:
			"GE FORCE endeavors to empower sports organizations to achieve gender balance within their leadership ranks. Through raising awareness, offering guidance, and extending support to emerging leaders in sports, we aim to facilitate their involvement in fostering the essential change needed to promote diversity and inclusion.",
		paragraph2:
			"Our research culminated in the production of three pivotal documents: a comprehensive systematic review report, a meticulously documented analysis report, and a best-practices report. These resources are made accessible to all, enabling sports organizations worldwide to enhance their efforts and advance gender equality on a global scale.",
		keywords: "Sports Organizations; Gender Equality; Women's Leadership;",
		researchers: "André Calapez & Tiago Ribeiro",
		website: "https://genderequalityforce.com/",
		image: geforce,
		slug: createSlug("GE Force"),
	},
	{
		id: 2,
		title: "Esports and Olympism",
		description:
			"The Esports and Olympism project investigates the intersection between esports and the values inherent in the Olympic movement. As esports continues to grow in popularity and influence, understanding how these digital competitions align with and propagate Olympic values such as excellence, friendship, and respect is crucial. This project aims to explore the potential for esports to be integrated into future Olympic Games and to assess the impact of Olympic values on player behavior and community dynamics within esports.",
		paragraph1:
			"The Esports and Olympism project investigates the intersection between esports and the values inherent in the Olympic movement. As esports continues to grow in popularity and influence, understanding how these digital competitions align with and propagate Olympic values such as excellence, friendship, and respect is crucial.",
		paragraph2:
			"This project aims to explore the potential for esports to be integrated into future Olympic Games and to assess the impact of Olympic values on player behavior and community dynamics within esports.",
		implications:
			"The findings from this project have significant implications for both the esports industry and the Olympic movement. By demonstrating that Olympic values can positively influence player behavior and community dynamics, this research supports the potential inclusion of esports in the Olympic Games. Furthermore, the insights into social capital formation and word-of-mouth promotion provide valuable information for esports publishers and developers seeking to integrate and propagate Olympic values within their games.",
		conclusion:
			"The Esports and Olympism project contributes to a deeper understanding of how the values of Olympism can be cultivated and sustained within the rapidly growing esports landscape. By bridging the gap between traditional sports values and digital gaming, this research opens new avenues for promoting positive behaviors and strengthening community ties in esports, ultimately enhancing the alignment between esports and the Olympic ethos.",
		keywords: "Esports; Olympism; Olympic Values; Commitment; Social Capital;",
		researchers: "André Calapez & Tiago Ribeiro",
		output1:
			"https://www.emerald.com/insight/content/doi/10.1108/IJSMS-12-2022-0215/full/html?casa_token=7cs7wegHn9UAAAAA:2ZlJ9EaLvaKMRBmgP8rEvjOMnM_wWb11jC2ekKZPBNky-WYp9M09x847nsa4gDhXy3QYHrTAcr5OpAPK1RPX52l2U6vW2ym2XrEPUwDKs9S0t9uRgiiK",
		output2: "https://journals.sagepub.com/doi/full/10.1177/10468781231197175",
		output3: "https://doi.org/10.1080/02614367.2023.2215470",
		website: "",
		book: "",
		image: "",
		slug: createSlug("Esports and Olympism"),
	},
	{
		id: 3,
		title:
			"SOPROS - Assessing, Evaluating and Implementing Athletes' Social Protection in Olympic Sports",
		description:
			"The SOPROS project responds to the pressing need for enhanced social protection standards for elite athletes, addressing a range of issues highlighted by recent incidents and policy initiatives. With a focus on Olympic sports, SOPROS aims to promote integrity and values by assessing, evaluating, and implementing social protection measures. Building upon the groundwork laid by the EMPLOYS project, SOPROS will develop Self-Assessment Tools for athletes, sport governing bodies, and public authorities to gather unique data, analyze findings in an Evaluation Report, and produce a Manual for the Implementation of Athletes’ Social Protection. Additionally, SOPROS will pilot negotiation processes in Olympic elite sports, offering insights into their benefits and challenges, and will facilitate workshops and conferences to engage stakeholders at national and EU levels. Through collaboration with academic and policy partners, SOPROS endeavors to shape tangible actions that safeguard the well-being and rights of elite athletes.",
		paragraph1:
			"The SOPROS project responds to the pressing need for enhanced social protection standards for elite athletes, addressing a range of issues highlighted by recent incidents and policy initiatives. With a focus on Olympic sports, SOPROS aims to promote integrity and values by assessing, evaluating, and implementing social protection measures.",
		paragraph2:
			"Building upon the groundwork laid by the EMPLOYS project, SOPROS will develop Self-Assessment Tools for athletes, sport governing bodies, and public authorities to gather unique data, analyze findings in an Evaluation Report, and produce a Manual for the Implementation of Athletes’ Social Protection.",
		paragraph3:
			"Additionally, SOPROS will pilot negotiation processes in Olympic elite sports, offering insights into their benefits and challenges, and will facilitate workshops and conferences to engage stakeholders at national and EU levels. Through collaboration with academic and policy partners, SOPROS endeavors to shape tangible actions that safeguard the well-being and rights of elite athletes.",
		keywords:
			"Athletes; Social Rights; Social Security; Athlete Protection; Governance; Safeguarding;",
		researchers: "Tiago Ribeiro & Luiz Haas",
		image: sopros,
		slug: createSlug("SOPROS"),
	},
	{
		id: 4,
		title: "SEMASC",
		description:
			"SEMASC tackles two primary challenges facing amateur sports clubs. Firstly, it aims to equip these clubs with the capacity to navigate changes and crises by developing a tailored tool for European and South American clubs to assess their socioeconomic models. This tool will enable clubs to benchmark themselves, identify areas for improvement, and access training resources to enhance their resilience. Secondly, SEMASC seeks to enhance the sustainability of amateur sports clubs, especially in light of recent challenges like the Covid-19 crisis, by establishing an international database through data collection from 3000 clubs. By utilizing SEMASC dimensions as benchmarks, stakeholders can identify strengths and weaknesses, driving pedagogical and structural reforms. Subsequently, pedagogical resources will be disseminated widely to national and international federations and Olympic committees, aiming to improve managerial practices across the board.",
		paragraph1:
			"SEMASC tackles two primary challenges facing amateur sports clubs. Firstly, it aims to equip these clubs with the capacity to navigate changes and crises by developing a tailored tool for European and South American clubs to assess their socioeconomic models.",
		paragraph2:
			"This tool will enable clubs to benchmark themselves, identify areas for improvement, and access training resources to enhance their resilience. Secondly, SEMASC seeks to enhance the sustainability of amateur sports clubs, especially in light of recent challenges like the Covid-19 crisis, by establishing an international database through data collection from 3000 clubs.",
		paragraph3:
			"By utilizing SEMASC dimensions as benchmarks, stakeholders can identify strengths and weaknesses, driving pedagogical and structural reforms. Subsequently, pedagogical resources will be disseminated widely to national and international federations and Olympic committees, aiming to improve managerial practices across the board.",
		keywords: "Amateur Clubs; Socioeconomic Model; Operational Management;",
		researchers: "André Calapez & Tiago Ribeiro & Ana Santos",
		image: semasc,
		slug: createSlug("SEMASC"),
	},
];

export const PHD_PROJECTS = [
	{
		id: 0,
		title:
			"Esports' toxic behaviours and their impact on the players' need satisfaction, toxic consumption practices and well-being.",
		description:
			"The esports industry, characterized by its competitive intensity and vibrant online communities, has seen a rise in toxic behaviours that significantly impact players' experiences. This PhD project aims to investigate the intricate relationships between toxic behaviours, players' need satisfaction, well-being, and toxic consumption practices (smurfing, excessive spending, and indoctrinating) within esports. Utilizing the online disinhibition effect theory, we will explore how the digital environment influences players' need satisfaction and subsequently links to their toxic consumption behaviours and well-being. Guided by Bourdieu's theory of practice and Suler's online disinhibition effect theory, we seek to explain the social and cultural roots of toxic behaviours in gaming. Simultaneously, we will apply the need satisfaction theory to understand how unmet needs drive players towards toxic consumption, and paradox theory to elucidate the contradictory outcomes of these behaviors on their well-being. Our research will proceed in four phases. The first phase involves an integrative review of the existing literature on toxic behaviours and their impact on players. In the second phase, we will collect and analyze players' life stories to gain deep insights into how toxic behaviours have manifested and evolved in their gaming experiences. The final phase will involve developing and validating a comprehensive scale for measuring toxic consumption behaviours and employing structural equation modelling to analyze the relationships among toxic behaviours, need satisfaction, well-being, and toxic consumption. Finally, we will look to disseminate our findings through civil society and bear an impact on the esports field in Portugal. Through this multi-faceted approach, our study aims to contribute to a deeper understanding of the psychosocial dynamics in esports, providing valuable insights for improving player experiences, fostering healthier gaming communities and enhancing game publishers' product strategy with a focus on their marketing endeavours.",
		paragraph1:
			"The esports industry, characterized by its competitive intensity and vibrant online communities, has seen a rise in toxic behaviours that significantly impact players' experiences. This PhD project aims to investigate the intricate relationships between toxic behaviours, players' need satisfaction, well-being, and toxic consumption practices (smurfing, excessive spending, and indoctrinating) within esports. Utilizing the online disinhibition effect theory, we will explore how the digital environment influences players' need satisfaction and subsequently links to their toxic consumption behaviours and well-being.",
		paragraph2:
			"Guided by Bourdieu's theory of practice and Suler's online disinhibition effect theory, we seek to explain the social and cultural roots of toxic behaviours in gaming. Simultaneously, we will apply the need satisfaction theory to understand how unmet needs drive players towards toxic consumption, and paradox theory to elucidate the contradictory outcomes of these behaviors on their well-being.",
		paragraph3:
			"Our research will proceed in four phases. The first phase involves an integrative review of the existing literature on toxic behaviours and their impact on players. In the second phase, we will collect and analyze players' life stories to gain deep insights into how toxic behaviours have manifested and evolved in their gaming experiences. The final phase will involve developing and validating a comprehensive scale for measuring toxic consumption behaviours and employing structural equation modelling to analyze the relationships among toxic behaviours, need satisfaction, well-being, and toxic consumption. Finally, we will look to disseminate our findings through civil society and bear an impact on the esports field in Portugal.",
		paragraph4:
			"Through this multi-faceted approach, our study aims to contribute to a deeper understanding of the psychosocial dynamics in esports, providing valuable insights for improving player experiences, fostering healthier gaming communities and enhancing game publishers' product strategy with a focus on their marketing endeavours.",
		keywords: "Toxic Behaviour; Esports; Need Satisfaction; Well-Being; Consumption;",
		university: "University of Lisbon, Faculty of Human Kinetics",
		author: "André Calapez",
		professorAdvisor: "Tiago Ribeiro",
		slug: createSlug(
			"Esports' toxic behaviours and their impact on the players' need satisfaction, toxic consumption practices and well-being."
		),
	},
	{
		id: 1,
		title: "Esports' events leverage and a new approach: Digital Leverage",
		description:
			"The number of eSports events has been rising since the turn of the decade, and with it a higher number of different locations have hosted these events. This PhD project aims to investigate how do eSports events organizers understand the use of strategic leverage to maximize the benefits of the many stakeholders around the event, specially the host community. Moreover this study aims to understand if a new kind of leverage is appearing, through these events: digital leverage. If so, it is important to investigate what is digital leverage, how does it fit in eSports events leverage and why is it used.  Chalip's (2004) economic leverage model and Chalip's (2006) social leverage model, for sports events, will be used to understand what kind of influence does digital leverage have over these two kind of strategies. This study will use an mixed method approach. First, by using focus groups and interviews with event stakeholders, to understand what kind of leverage strategies are used and to acknowledge digital leverage. Second, this research will aim to develop a scale for measuring the outcome of the leverage strategies implemented, by applying it to the targets of these strategies. Thus, this study aims to contribute to strategic leverage literature and eSports events literature, by exploring the event organizers leverage planning and strategy implementation. Moreover, this research wants to develop the concept of digital leverage, which can bring new insights to eSports events organizers and it's stakedholders and new opportunitys to leverage targets.",
		paragraph1:
			"The number of eSports events has been rising since the turn of the decade, and with it a higher number of different locations have hosted these events. This PhD project aims to investigate how do eSports events organizers understand the use of strategic leverage to maximize the benefits of the many stakeholders around the event, specially the host community.",
		paragraph2:
			"Moreover this study aims to understand if a new kind of leverage is appearing, through these events: digital leverage. If so, it is important to investigate what is digital leverage, how does it fit in eSports events leverage and why is it used.  Chalip's (2004) economic leverage model and Chalip's (2006) social leverage model, for sports events, will be used to understand what kind of influence does digital leverage have over these two kind of strategies. This study will use an mixed method approach.",
		paragraph3:
			"First, by using focus groups and interviews with event stakeholders, to understand what kind of leverage strategies are used and to acknowledge digital leverage.",
		paragraph4:
			"Second, this research will aim to develop a scale for measuring the outcome of the leverage strategies implemented, by applying it to the targets of these strategies.",
		paragraph5:
			"Thus, this study aims to contribute to strategic leverage literature and eSports events literature, by exploring the event organizers leverage planning and strategy implementation. Moreover, this research wants to develop the concept of digital leverage, which can bring new insights to eSports events organizers and it's stakedholders and new opportunitys to leverage targets.",
		keywords: "Event Leverage; Esports; Digital Leverage; Strategy;",
		university: "University of Lisbon, Faculty of Human Kinetics",
		author: "Luís Cerqueira",
		co_advisor: "Vítor Sobral",
		professorAdvisor: "Tiago Ribeiro",
		slug: createSlug("Esports' events leverage and a new approach: Digital Leverage"),
	},
	{
		id: 2,
		title: "Web3 and Sports: How blockchain technology can remodel sports business models",
		description:
			"The sports industry, known for its dynamic nature and passionate fan base, is undergoing significant transformation with the rise of Web3 technologies. This PhD project investigates the interplay between blockchain technology, fan engagement, and business models of sports organizations. By leveraging blockchain's decentralized and transparent nature, we explore how Web3 can enhance fan participation, improve governance, and create new revenue streams. Utilizing the Decentralized Autonomous Organizations (DAOs) and smart contracts framework, we analyze how these technologies can democratize decision-making processes and enhance operational transparency within sports organizations. Guided by theories of technological innovation, collaborative governance, and stakeholder engagement, this research seeks to uncover the potential of Web3 to revolutionize the sports industry and apply organizational theory to understand how sports entities can adapt and integrate these technologies. The goal is to comprehensively understand how Web3 technologies can enhance the sports industry, offering practical recommendations for sports organizations and policymakers. By disseminating our findings through academic publications, industry conferences, and collaborations, we aim to contribute to the sports sector's sustainable and innovative growth.",
		paragraph1:
			"The sports industry, known for its dynamic nature and passionate fan base, is undergoing significant transformation with the rise of Web3 technologies. This PhD project investigates the interplay between blockchain technology, fan engagement, and business models of sports organizations.",
		paragraph2:
			"By leveraging blockchain's decentralized and transparent nature, we explore how Web3 can enhance fan participation, improve governance, and create new revenue streams. Utilizing the Decentralized Autonomous Organizations (DAOs) and smart contracts framework, we analyze how these technologies can democratize decision-making processes and enhance operational transparency within sports organizations.",
		paragraph3:
			"Guided by theories of technological innovation, collaborative governance, and stakeholder engagement, this research seeks to uncover the potential of Web3 to revolutionize the sports industry and apply organizational theory to understand how sports entities can adapt and integrate these technologies.",
		paragraph4:
			"The goal is to comprehensively understand how Web3 technologies can enhance the sports industry, offering practical recommendations for sports organizations and policymakers. By disseminating our findings through academic publications, industry conferences, and collaborations, we aim to contribute to the sports sector's sustainable and innovative growth.",
		keywords: "Sport Management; Web3; Blockchain; DAOs;",
		university: "State University of Rio de Janeiro",
		year: "2024",
		author: "Vitor Principe",
		professorAdvisor: "Rodolfo Nunes",
		co_advisor: "Tiago Ribeiro",
		slug: createSlug(
			"Web3 and Sports: How blockchain technology can remodel sports business models"
		),
	},
];

export const NAV_LINKS = [
	{
		name: "Initiatives",
		path: "/initiatives",
		children: [
			{
				name: "Post Graduation in ESports and Digital Communities",
				path: "/initiatives/post-graduation-in-esports-and-digital-communities",
			},
			{
				name: "National Laboratory of Scientific Research in Esports",
				path: "/initiatives/national-laboratory-of-scientific-research-in-esports",
			},
		],
	},
	{
		name: "Team",
		path: "/team",
	},
	{
		name: "Projects",
		path: "/projects",
		children: [
			{
				name: "Master",
				path: "/projects/master",
			},
			{
				name: "Research",
				path: "/projects/research",
			},
			{
				name: "PhD",
				path: "/projects/phd",
			},
		],
	},
	{
		name: "Partners",
		path: "/partners",
	},
	{
		name: "News",
		path: "/news",
	},
	{
		name: "Contact Us",
		path: "/contact-us",
	},
];

export const TEAM = [
	{
		name: "Vitor Principe",
		image: vprincipe,
		position: "Researcher",
		translatedDescription:
			"Born in 1983 in Rio de Janeiro/Brazil, Vitor Ayres Principe moved to Portugal in 2024. He has an extensive academic background and vast professional experience. He graduated in Physical Education (2006), Mathematics (2009), and Data Science (2022) from Universidade Estácio de Sá. Additionally, he is a specialist in Business Administration from FGV (2010) and Leadership and Technology Management from Conquer Business School (2023). Vitor holds a master's degree in Civil Engineering from UFF (2013) and Exercise and Sports Sciences from UERJ (2020). He is completing his doctoral Sociology and Sports Management internship at FMH/UL. He will return to Brazil to finish his Exercise and Sports Sciences doctorate at UERJ in August 2024. Vitor has worked as a professor at several educational institutions in Brazil.",
		paragraph1:
			"Born in 1983 in Rio de Janeiro/Brazil, Vitor Ayres Principe moved to Portugal in 2024. He has an extensive academic background and vast professional experience.",
		paragraph2:
			"He graduated in Physical Education (2006), Mathematics (2009), and Data Science (2022) from Universidade Estácio de Sá. Additionally, he is a specialist in Business Administration from FGV (2010) and Leadership and Technology Management from Conquer Business School (2023). Vitor holds a master's degree in Civil Engineering from UFF (2013) and Exercise and Sports Sciences from UERJ (2020).",
		paragraph3:
			"He is completing his doctoral Sociology and Sports Management internship at FMH/UL. He will return to Brazil to finish his Exercise and Sports Sciences doctorate at UERJ in August 2024. Vitor has worked as a professor at several educational institutions in Brazil.",
	},
];

export const TYPES_OF_PROJECTS = [
	{
		id: 0,
		name: "Master projects",
		slug: "master",
		projects: MASTER_PROJECTS,
	},
	{
		id: 1,
		name: "Research projects",
		slug: "research",
		projects: RESEARCH_PROJECTS,
	},
	{
		id: 2,
		name: "Phd projects",
		slug: "phd",
		projects: PHD_PROJECTS,
	},
];

export const NEWS = [
	{
		id: 0,
		title: "SEMASC Project Transnational Meeting Held in Cascais",
		slug: createSlug("SEMASC Project Transnational Meeting Held in Cascais"),
		content: {
			paragraph1:
				"On April 16th and 17th, the city of Cascais, Portugal, hosted the transnational meeting of the SEMASC (Socioeconomic Model of Amateur Sports Clubs) project. The event brought together renowned researchers and association leaders from various countries, including Portugal, France, Lithuania, Luxembourg, Poland, Brazil, Ecuador, Argentina, and Chile. This project, funded by the Erasmus Sport program, aims to strengthen the socioeconomic path of amateur sports clubs in these countries.",
			paragraph2:
				"During the two-day meeting, productive discussions and strategic alignments were held, aimed at creating a socioeconomic analysis model in sports. Among the main objectives of the SEMASC project are conducting research on resilience factors of associative sports clubs' socioeconomic models, designing an online self-diagnostic tool for sports association leaders, and developing pedagogical tools to reinforce these models.",
			paragraph3:
				"The event, organized by the Faculty of Human Kinetics at the University of Lisbon, highlighted the importance of international collaboration for the project's success. The coordination was led by project coordinator Yann Carin, along with Portuguese representatives Tiago Ribeiro and Ana Santos. Among the participants were also André Calapez, Cingiene Vilma, Mindaugas Spokas, Igor Perechuda, Mateusz Tomanek, Arnaud Waquet, Marco Lorenzatti, Elodie Mangez, Julien Harmonier, and Eva Beccavin-Gouy, who contributed significantly to the discussions.",
			paragraph4:
				"With the success of this meeting, the SEMASC project takes an important step towards implementing its goals, reaffirming the fundamental role of amateur sports in strengthening communities and promoting social inclusion.",
		},
		date: "2024-04-18",
		images: [semascNews1, semascNews2],
	},
	{
		id: 1,
		title: "SIMERG Participation in the iWorkinSport Fair",
		slug: createSlug("SIMERG Participation in the iWorkinSport Fair"),
		date: "2024-06-05",
		content: {
			paragraph1:
				"In early June, the SIMERG participated in the iWorkinSport fair, held in Lausanne, Switzerland. This event, recognized as one of the leading job fairs in the sports industry, provided an excellent opportunity for students and professionals to connect with important organizations in the sector, such as FIBA, World Aquatics, and the International Olympic Committee (IOC).",
			paragraph2:
				"The visit was coordinated by Professor Tiago Ribeiro, who led the students of the GOALS - Erasmus Mundus Master in Sport Management program at the fair. Participation in iWorkinSport allowed students to interact with representatives from major sports entities, expanding their networks and gaining valuable insights into the dynamics and demands of the sports job market.",
			paragraph3:
				"During their stay in Lausanne, the students also had the opportunity to visit the Olympic Museum and the IOC headquarters, further enriching their experience.",
		},
	},
	{
		id: 2,
		title: "The Rise of Esports in Brazil",
		slug: createSlug("The Rise of Esports in Brazil"),
		date: "2024-02-15",
		content:
			"Esports has been growing rapidly in Brazil, with more investments and professional teams emerging...",
	},
	{
		id: 3,
		title: "Mental Health in Gaming: Breaking the Stigma",
		slug: createSlug("Mental Health in Gaming: Breaking the Stigma"),
		date: "2024-03-10",
		content:
			"The gaming community is increasingly addressing mental health issues, with initiatives to support players...",
	},
	{
		id: 4,
		title: "New Technologies Revolutionizing Game Development",
		slug: createSlug("New Technologies Revolutionizing Game Development"),
		date: "2024-03-05",
		content:
			"From AI to virtual reality, new technologies are changing the way games are developed and experienced...",
	},
	{
		id: 5,
		title: "The Impact of Streaming on the Gaming Industry",
		slug: createSlug("The Impact of Streaming on the Gaming Industry"),
		date: "2024-02-20",
		content:
			"Streaming platforms have transformed how games are marketed and consumed, creating new opportunities...",
	},
	{
		id: 6,
		title: "Diversity and Inclusion in the Gaming World",
		slug: createSlug("Diversity and Inclusion in the Gaming World"),
		date: "2023-02-25",
		content:
			"The gaming industry is making strides towards greater diversity and inclusion, both in game content and workforce...",
	},
	{
		id: 7,
		title: "The Future of Mobile Gaming",
		slug: createSlug("The Future of Mobile Gaming"),
		date: "2023-02-30",
		content:
			"With advancements in smartphone technology, mobile gaming is set to reach new heights in graphics and gameplay...",
	},
];
