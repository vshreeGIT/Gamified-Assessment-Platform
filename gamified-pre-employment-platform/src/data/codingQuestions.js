const codingQuestions = {

variables: [

{
id: 1,
title: "Variable Declaration",
difficulty:"easy",
xp: 10,

statement:
`Write a program to declare an integer variable and print its value.

Read an integer N from the user and store it in a variable.
Print the value stored.`,

inputFormat:
`A single integer N.`,

outputFormat:
`Print the integer.`,

constraints:
`1 ≤ N ≤ 100000`,

examples: [

{
input:
`25`,

output:
`25`,

explanation:
`The value is stored inside an integer variable and printed.`
}

],

runTestCases: [

{
input: `10`,
output: `10`
},

{
input: `500`,
output: `500`
}

],

hiddenTestCases: [

{
input:`99999`,
output:`99999`
},

{
input:`1`,
output:`1`
}

],

starterCode:{

java:
`import java.util.*;

public class Main {

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code here

    }

}`,

python:
`n=int(input())

# Write your code here`,

cpp:
`#include<iostream>
using namespace std;

int main(){

    // Write your code here

}`,

c:
`#include<stdio.h>

int main(){

    // Write your code here

}`

},

tags:["Variables"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:2,

title:"Swap Two Numbers",

difficulty:"easy",

xp:15,

statement:
`Read two integers and swap them using a third variable.

Print the swapped values.`,

inputFormat:
`Two integers A and B.`,

outputFormat:
`Swapped values.`,

constraints:
`-1000 ≤ A,B ≤ 1000`,

examples:[
{
input:
`10 20`,

output:
`20 10`,

explanation:
`Values are swapped using a temporary variable.`
}
],

runTestCases:[
{
input:`4 8`,
output:`8 4`
},
{
input:`15 3`,
output:`3 15`
}
],

hiddenTestCases:[
{
input:`100 200`,
output:`200 100`
}
],

tags:["Variables"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:3,

title:"Sum of Two Numbers",

difficulty:"easy",

xp:20,

statement:
`Read two integers and print their sum.`,

inputFormat:
`Two integers.`,

outputFormat:
`Sum.`,

constraints:
`-100000 ≤ A,B ≤ 100000`,

examples:[
{
input:
`5 8`,

output:
`13`
}
],

runTestCases:[
{
input:`10 20`,
output:`30`
},
{
input:`15 18`,
output:`33`
}
],

hiddenTestCases:[
{
input:`99999 1`,
output:`100000`
}
],

tags:["Variables"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:4,

title:"Average of Three Numbers",

difficulty:"easy",

xp:20,

statement:
`Read three integers and print their average.

The output should be printed with two decimal places.`,

inputFormat:
`Three integers.`,

outputFormat:
`Average.`,

constraints:
`1 ≤ N ≤ 1000`,

examples:[
{
input:
`10 20 30`,

output:
`20.00`
}
],

runTestCases:[
{
input:`5 5 5`,
output:`5.00`
},
{
input:`3 6 9`,
output:`6.00`
}
],

hiddenTestCases:[
{
input:`100 200 300`,
output:`200.00`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:5,

title:"Area of Rectangle",

difficulty:"easy",

xp:25,

statement:
`Read length and breadth of a rectangle.

Print its area.`,

inputFormat:
`Two integers.`,

outputFormat:
`Area.`,

constraints:
`1 ≤ Length,Breadth ≤ 10000`,

examples:[
{
input:
`5 8`,

output:
`40`
}
],

runTestCases:[
{
input:`10 5`,
output:`50`
},
{
input:`7 4`,
output:`28`
}
],

hiddenTestCases:[
{
input:`9999 9999`,
output:`99980001`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:6,

title:"Area of Circle",

difficulty:"easy",

xp:25,

statement:
`Read the radius of a circle and calculate its area.

Use π = 3.14.

Print the answer rounded to two decimal places.`,

inputFormat:
`A single integer radius.`,

outputFormat:
`Area of the circle.`,

constraints:
`1 ≤ Radius ≤ 1000`,

examples:[
{
input:`5`,
output:`78.50`,
explanation:`Area = 3.14 × 5 × 5`
}
],

runTestCases:[
{
input:`2`,
output:`12.56`
},
{
input:`10`,
output:`314.00`
}
],

hiddenTestCases:[
{
input:`25`,
output:`1962.50`
},
{
input:`100`,
output:`31400.00`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:7,

title:"Celsius to Fahrenheit",

difficulty:"easy",

xp:30,

statement:
`Read temperature in Celsius and convert it into Fahrenheit.

Formula:

F = (C × 9/5) + 32`,

inputFormat:
`A single integer C.`,

outputFormat:
`Temperature in Fahrenheit.`,

constraints:
`-100 ≤ C ≤ 100`,

examples:[
{
input:`25`,
output:`77.00`
}
],

runTestCases:[
{
input:`0`,
output:`32.00`
},
{
input:`100`,
output:`212.00`
}
],

hiddenTestCases:[
{
input:`37`,
output:`98.60`
}
],

tags:["Variables","Conversion"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:8,

title:"Simple Interest Calculator",

difficulty:"medium",

xp:40,

statement:
`Read Principal, Rate and Time.

Calculate the Simple Interest.

Formula:

SI = (P × R × T) / 100`,

inputFormat:
`Three integers P R T.`,

outputFormat:
`Simple Interest.`,

constraints:
`1 ≤ P ≤ 100000`,

examples:[
{
input:`1000 5 2`,
output:`100.00`
}
],

runTestCases:[
{
input:`5000 8 3`,
output:`1200.00`
},
{
input:`2000 10 1`,
output:`200.00`
}
],

hiddenTestCases:[
{
input:`15000 7 4`,
output:`4200.00`
}
],

tags:["Variables","Finance"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:9,

title:"BMI Calculator",

difficulty:"medium",

xp:45,

statement:
`Read weight (kg) and height (m).

Calculate BMI.

Formula:

BMI = weight / (height × height)

Print the answer rounded to two decimal places.`,

inputFormat:
`Weight Height`,

outputFormat:
`BMI Value`,

constraints:
`1 ≤ Weight ≤ 300`,

examples:[
{
input:`70 1.75`,
output:`22.86`
}
],

runTestCases:[
{
input:`60 1.60`,
output:`23.44`
},
{
input:`80 1.80`,
output:`24.69`
}
],

hiddenTestCases:[
{
input:`95 1.70`,
output:`32.87`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:10,

title:"Student Grade Calculator",

difficulty:"medium",

xp:50,

statement:
`Read marks of five subjects.

Calculate the average.

Display:

Average

Grade

Rules

Average ≥ 90 : Grade A

Average ≥ 75 : Grade B

Average ≥ 60 : Grade C

Otherwise Grade D`,

inputFormat:
`Five integers.`,

outputFormat:
`Average

Grade`,

constraints:
`0 ≤ Marks ≤ 100`,

examples:[
{
input:
`90 95 85 80 100`,

output:
`90.00
A`
}
],

runTestCases:[
{
input:`80 75 70 65 60`,
output:`70.00
C`
},
{
input:`100 100 100 100 100`,
output:`100.00
A`
}
],

hiddenTestCases:[
{
input:`55 60 58 57 59`,
output:`57.80
D`
}
],

tags:["Variables","Conditions"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:11,

title:"Currency Converter (INR to USD)",

difficulty:"medium",

xp:55,

statement:
`Read an amount in Indian Rupees (INR).

Convert it into US Dollars.

Use:

1 USD = 83 INR

Print the answer rounded to two decimal places.`,

inputFormat:
`A single integer representing INR.`,

outputFormat:
`Equivalent USD value.`,

constraints:
`1 ≤ INR ≤ 1000000`,

examples:[
{
input:`830`,
output:`10.00`,
explanation:`830 / 83 = 10`
}
],

runTestCases:[
{
input:`1660`,
output:`20.00`
},
{
input:`415`,
output:`5.00`
}
],

hiddenTestCases:[
{
input:`8300`,
output:`100.00`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:12,

title:"Electricity Bill Calculator",

difficulty:"medium",

xp:60,

statement:
`Read the number of electricity units consumed.

Calculate the bill using:

First 100 units -> ₹2/unit

Next 100 units -> ₹3/unit

Remaining units -> ₹5/unit

Print the total bill.`,

inputFormat:
`A single integer representing units.`,

outputFormat:
`Total electricity bill.`,

constraints:
`1 ≤ Units ≤ 10000`,

examples:[
{
input:`250`,
output:`950`,
explanation:
`100×2 + 100×3 + 50×5 = 950`
}
],

runTestCases:[
{
input:`90`,
output:`180`
},
{
input:`150`,
output:`350`
}
],

hiddenTestCases:[
{
input:`350`,
output:`1450`
}
],

tags:["Variables","Conditions"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:13,

title:"Gross Salary Calculator",

difficulty:"medium",

xp:65,

statement:
`Read the Basic Salary.

Calculate:

HRA = 20%

DA = 10%

Gross Salary = Basic + HRA + DA

Print Gross Salary.`,

inputFormat:
`A single integer representing Basic Salary.`,

outputFormat:
`Gross Salary.`,

constraints:
`1000 ≤ Salary ≤ 1000000`,

examples:[
{
input:`10000`,
output:`13000.00`
}
],

runTestCases:[
{
input:`25000`,
output:`32500.00`
},
{
input:`15000`,
output:`19500.00`
}
],

hiddenTestCases:[
{
input:`50000`,
output:`65000.00`
}
],

tags:["Variables","Salary"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:14,

title:"Percentage Calculator",

difficulty:"medium",

xp:70,

statement:
`Read marks of five subjects.

Find the percentage.

Formula:

(Total / 500) × 100

Print percentage rounded to two decimal places.`,

inputFormat:
`Five integers.`,

outputFormat:
`Percentage.`,

constraints:
`0 ≤ Marks ≤ 100`,

examples:[
{
input:`90 95 85 80 100`,
output:`90.00`
}
],

runTestCases:[
{
input:`50 60 70 80 90`,
output:`70.00`
},
{
input:`100 100 100 100 100`,
output:`100.00`
}
],

hiddenTestCases:[
{
input:`76 87 92 81 78`,
output:`82.80`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:15,

title:"Compound Interest Calculator",

difficulty:"hard",

xp:100,

statement:
`Read Principal (P), Rate (R), and Time (T).

Calculate Compound Interest using:

Amount = P × (1 + R/100)^T

Compound Interest = Amount − Principal

Print Compound Interest rounded to two decimal places.`,

inputFormat:
`Three integers P R T.`,

outputFormat:
`Compound Interest.`,

constraints:
`1 ≤ P ≤ 1000000`,

examples:[
{
input:`1000 10 2`,
output:`210.00`
}
],

runTestCases:[
{
input:`5000 5 2`,
output:`512.50`
},
{
input:`2000 8 3`,
output:`519.42`
}
],

hiddenTestCases:[
{
input:`10000 12 5`,
output:`7623.42`
}
],

tags:["Variables","Finance","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:16,

title:"Discount Calculator",

difficulty:"medium",

xp:75,

statement:
`Read the original price of an item and the discount percentage.

Calculate the final price after applying the discount.

Formula:

Discount = Price × Discount% / 100

Final Price = Price - Discount

Print the final price rounded to two decimal places.`,

inputFormat:
`Two integers:
Price
Discount Percentage`,

outputFormat:
`Final Price`,

constraints:
`1 ≤ Price ≤ 100000
0 ≤ Discount ≤ 100`,

examples:[
{
input:`2000 15`,
output:`1700.00`,
explanation:`15% of 2000 is 300. Final Price = 1700`
}
],

runTestCases:[
{
input:`5000 20`,
output:`4000.00`
},
{
input:`1200 10`,
output:`1080.00`
}
],

hiddenTestCases:[
{
input:`99999 35`,
output:`64999.35`
}
],

tags:["Variables","Math"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:17,

title:"Profit and Loss Calculator",

difficulty:"medium",

xp:80,

statement:
`Read Cost Price (CP) and Selling Price (SP).

If SP > CP print Profit.

If CP > SP print Loss.

Otherwise print No Profit No Loss.`,

inputFormat:
`Two integers.`,

outputFormat:
`Profit/Loss Amount
Result`,

constraints:
`1 ≤ CP,SP ≤ 1000000`,

examples:[
{
input:`500 650`,
output:
`150
Profit`
}
],

runTestCases:[
{
input:`1000 950`,
output:
`50
Loss`
},
{
input:`2000 2000`,
output:
`0
No Profit No Loss`
}
],

hiddenTestCases:[
{
input:`7500 9200`,
output:
`1700
Profit`
}
],

tags:["Variables","Conditions"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:18,

title:"Loan EMI Calculator",

difficulty:"hard",

xp:90,

statement:
`Read Loan Amount and Number of Months.

Assume Zero Interest.

Calculate Monthly EMI.

Formula:

EMI = Loan Amount / Months

Print EMI rounded to two decimal places.`,

inputFormat:
`Loan Amount
Months`,

outputFormat:
`Monthly EMI`,

constraints:
`1 ≤ Loan ≤ 10000000
1 ≤ Months ≤ 360`,

examples:[
{
input:`120000 12`,
output:`10000.00`
}
],

runTestCases:[
{
input:`600000 60`,
output:`10000.00`
},
{
input:`240000 24`,
output:`10000.00`
}
],

hiddenTestCases:[
{
input:`1500000 120`,
output:`12500.00`
}
],

tags:["Variables","Finance"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:19,

title:"Employee Salary Slip Generator",

difficulty:"hard",

xp:100,

statement:
`Read Employee Name and Basic Salary.

Calculate:

HRA = 15%

DA = 12%

PF = 8%

Gross Salary = Basic + HRA + DA

Net Salary = Gross Salary - PF

Print Employee Name and Net Salary.`,

inputFormat:
`Employee Name
Basic Salary`,

outputFormat:
`Employee Name
Net Salary`,

constraints:
`1000 ≤ Salary ≤ 1000000`,

examples:[
{
input:
`John
20000`,

output:
`John
23800.00`
}
],

runTestCases:[
{
input:
`Alice
30000`,

output:
`Alice
35700.00`
}
],

hiddenTestCases:[
{
input:
`David
45000`,

output:
`David
53550.00`
}
],

tags:["Variables","Salary"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:20,

title:"Bank Fixed Deposit Interest",

difficulty:"hard",

xp:120,

statement:
`Read Principal, Rate and Time.

Calculate Final Amount using Simple Interest.

Formula:

Interest = (P × R × T)/100

Amount = Principal + Interest

Print Final Amount rounded to two decimal places.`,

inputFormat:
`Principal
Rate
Time`,

outputFormat:
`Final Amount`,

constraints:
`1 ≤ Principal ≤ 10000000`,

examples:[
{
input:
`10000 8 2`,

output:
`11600.00`
}
],

runTestCases:[
{
input:`5000 10 5`,
output:`7500.00`
},
{
input:`25000 6 3`,
output:`29500.00`
}
],

hiddenTestCases:[
{
input:`150000 9 4`,
output:`204000.00`
}
],

tags:["Variables","Finance"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

}


],

datatypes   :[
  {
id:1,

title:"Identify Data Type",

difficulty:"easy",

xp:10,

statement:
`Read an integer from the user and print the value.

This problem helps you understand how integer data types store values.`,

inputFormat:
`A single integer.`,

outputFormat:
`Print the integer.`,

constraints:
`-100000 ≤ N ≤ 100000`,

examples:[
{
input:`25`,
output:`25`,
explanation:`The integer is stored in an int variable and printed.`
}
],

runTestCases:[
{
input:`100`,
output:`100`
},
{
input:`-25`,
output:`-25`
}
],

hiddenTestCases:[
{
input:`99999`,
output:`99999`
},
{
input:`0`,
output:`0`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["Data Types","int"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//--------------------------------------------------

{
id:2,

title:"Store Different Data Types",

difficulty:"easy",

xp:15,

statement:
`Read an integer, a decimal number and a character.

Print all values in the same order.`,

inputFormat:
`Integer
Decimal
Character`,

outputFormat:
`Print all values.`,

constraints:
`Valid inputs only.`,

examples:[
{
input:
`25
3.14
A`,

output:
`25
3.14
A`
}
],

runTestCases:[
{
input:
`10
5.5
X`,
output:
`10
5.5
X`
}
],

hiddenTestCases:[
{
input:
`99
9.99
Z`,
output:
`99
9.99
Z`
}
],

tags:["Data Types"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//--------------------------------------------------

{
id:3,

title:"Integer to Double Conversion",

difficulty:"easy",

xp:20,

statement:
`Read an integer.

Convert it into double.

Print the converted value with one decimal place.`,

inputFormat:
`Integer`,

outputFormat:
`Double Value`,

constraints:
`1 ≤ N ≤ 10000`,

examples:[
{
input:`25`,
output:`25.0`
}
],

runTestCases:[
{
input:`100`,
output:`100.0`
}
],

hiddenTestCases:[
{
input:`999`,
output:`999.0`
}
],

tags:["Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//--------------------------------------------------

{
id:4,

title:"Double to Integer Conversion",

difficulty:"easy",

xp:20,

statement:
`Read a double value.

Convert it into integer.

Print the integer part only.`,

inputFormat:
`Double`,

outputFormat:
`Integer`,

constraints:
`0 ≤ N ≤ 100000`,

examples:[
{
input:`12.98`,
output:`12`
}
],

runTestCases:[
{
input:`55.75`,
output:`55`
}
],

hiddenTestCases:[
{
input:`999.99`,
output:`999`
}
],

tags:["Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//--------------------------------------------------

{
id:5,

title:"ASCII Value of Character",

difficulty:"easy",

xp:25,

statement:
`Read a character.

Print its ASCII value.`,

inputFormat:
`A character.`,

outputFormat:
`ASCII Value`,

constraints:
`Any valid ASCII character.`,

examples:[
{
input:`A`,
output:`65`,
explanation:`ASCII of A is 65`
}
],

runTestCases:[
{
input:`a`,
output:`97`
},
{
input:`0`,
output:`48`
}
],

hiddenTestCases:[
{
input:`Z`,
output:`90`
}
],

tags:["char","ASCII"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},
//-------------------------------------------------------

{
id:6,

title:"Character to Integer Conversion",

difficulty:"easy",

xp:30,

statement:
`Read a single character and print its ASCII value as an integer.

This problem helps understand how characters are internally stored as integers.`,

inputFormat:
`A single character.`,

outputFormat:
`Print the ASCII value.`,

constraints:
`Input is a valid ASCII character.`,

examples:[
{
input:`A`,
output:`65`,
explanation:`ASCII value of 'A' is 65.`
}
],

runTestCases:[
{
input:`a`,
output:`97`
},
{
input:`0`,
output:`48`
}
],

hiddenTestCases:[
{
input:`Z`,
output:`90`
},
{
input:`@`,
output:`64`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Character","ASCII","Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:7,

title:"Check Data Type Range",

difficulty:"medium",

xp:40,

statement:
`Read an integer.

Determine whether it can be stored in:

byte
short
int

Print all matching data types.`,

inputFormat:
`A single integer.`,

outputFormat:
`Possible data types.`,

constraints:
`-2147483648 ≤ N ≤ 2147483647`,

examples:[
{
input:`100`,
output:
`byte
short
int`
}
],

runTestCases:[
{
input:`200`,
output:
`short
int`
},
{
input:`50000`,
output:
`int`
}
],

hiddenTestCases:[
{
input:`127`,
output:
`byte
short
int`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Data Types","Range"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:8,

title:"Integer Overflow Check",

difficulty:"medium",

xp:45,

statement:
`Read two integers.

Multiply them using long data type.

Print the result.

This problem teaches why long should be used to avoid integer overflow.`,

inputFormat:
`Two integers.`,

outputFormat:
`Product.`,

constraints:
`1 ≤ Numbers ≤ 100000`,

examples:[
{
input:`50000 50000`,
output:`2500000000`
}
],

runTestCases:[
{
input:`10000 10000`,
output:`100000000`
},
{
input:`25000 30000`,
output:`750000000`
}
],

hiddenTestCases:[
{
input:`99999 99999`,
output:`9999800001`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Use long datatype

}

}`

},

tags:["Overflow","long"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:9,

title:"Primitive Data Type Calculator",

difficulty:"medium",

xp:50,

statement:
`Read two integers and an operator.

Operator can be:

+
-
*
/

Perform the operation and print the result.`,

inputFormat:
`Integer
Operator
Integer`,

outputFormat:
`Result`,

constraints:
`Numbers are between -100000 and 100000.`,

examples:[
{
input:
`10
+
20`,

output:`30`
}
],

runTestCases:[
{
input:
`30
-
10`,

output:`20`
},
{
input:
`5
*
8`,

output:`40`
}
],

hiddenTestCases:[
{
input:
`100
/
5`,

output:`20`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Operators","Primitive"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:10,

title:"Type Promotion",

difficulty:"medium",

xp:55,

statement:
`Read one integer and one double.

Add both values.

Print the answer rounded to two decimal places.

Understand automatic type promotion during arithmetic operations.`,

inputFormat:
`Integer
Double`,

outputFormat:
`Double Result`,

constraints:
`1 ≤ Values ≤ 100000`,

examples:[
{
input:
`10
5.75`,

output:`15.75`
}
],

runTestCases:[
{
input:
`25
4.5`,

output:`29.50`
},
{
input:
`100
20.25`,

output:`120.25`
}
],

hiddenTestCases:[
{
input:
`999
1.01`,

output:`1000.01`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Type Promotion","double"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},
//-------------------------------------------------------

{
id:6,

title:"Character to Integer Conversion",

difficulty:"easy",

xp:30,

statement:
`Read a single character and print its ASCII value as an integer.

This problem helps understand how characters are internally stored as integers.`,

inputFormat:
`A single character.`,

outputFormat:
`Print the ASCII value.`,

constraints:
`Input is a valid ASCII character.`,

examples:[
{
input:`A`,
output:`65`,
explanation:`ASCII value of 'A' is 65.`
}
],

runTestCases:[
{
input:`a`,
output:`97`
},
{
input:`0`,
output:`48`
}
],

hiddenTestCases:[
{
input:`Z`,
output:`90`
},
{
input:`@`,
output:`64`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Character","ASCII","Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:7,

title:"Check Data Type Range",

difficulty:"Medium",

xp:40,

statement:
`Read an integer.

Determine whether it can be stored in:

byte
short
int

Print all matching data types.`,

inputFormat:
`A single integer.`,

outputFormat:
`Possible data types.`,

constraints:
`-2147483648 ≤ N ≤ 2147483647`,

examples:[
{
input:`100`,
output:
`byte
short
int`
}
],

runTestCases:[
{
input:`200`,
output:
`short
int`
},
{
input:`50000`,
output:
`int`
}
],

hiddenTestCases:[
{
input:`127`,
output:
`byte
short
int`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Data Types","Range"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:8,

title:"Integer Overflow Check",

difficulty:"medium",

xp:45,

statement:
`Read two integers.

Multiply them using long data type.

Print the result.

This problem teaches why long should be used to avoid integer overflow.`,

inputFormat:
`Two integers.`,

outputFormat:
`Product.`,

constraints:
`1 ≤ Numbers ≤ 100000`,

examples:[
{
input:`50000 50000`,
output:`2500000000`
}
],

runTestCases:[
{
input:`10000 10000`,
output:`100000000`
},
{
input:`25000 30000`,
output:`750000000`
}
],

hiddenTestCases:[
{
input:`99999 99999`,
output:`9999800001`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Use long datatype

}

}`

},

tags:["Overflow","long"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:9,

title:"Primitive Data Type Calculator",

difficulty:"medium",

xp:50,

statement:
`Read two integers and an operator.

Operator can be:

+
-
*
/

Perform the operation and print the result.`,

inputFormat:
`Integer
Operator
Integer`,

outputFormat:
`Result`,

constraints:
`Numbers are between -100000 and 100000.`,

examples:[
{
input:
`10
+
20`,

output:`30`
}
],

runTestCases:[
{
input:
`30
-
10`,

output:`20`
},
{
input:
`5
*
8`,

output:`40`
}
],

hiddenTestCases:[
{
input:
`100
/
5`,

output:`20`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Operators","Primitive"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:10,

title:"Type Promotion",

difficulty:"medium",

xp:55,

statement:
`Read one integer and one double.

Add both values.

Print the answer rounded to two decimal places.

Understand automatic type promotion during arithmetic operations.`,

inputFormat:
`Integer
Double`,

outputFormat:
`Double Result`,

constraints:
`1 ≤ Values ≤ 100000`,

examples:[
{
input:
`10
5.75`,

output:`15.75`
}
],

runTestCases:[
{
input:
`25
4.5`,

output:`29.50`
},
{
input:
`100
20.25`,

output:`120.25`
}
],

hiddenTestCases:[
{
input:
`999
1.01`,

output:`1000.01`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

// Write your code

}

}`

},

tags:["Type Promotion","double"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},
//-------------------------------------------------------

{
id:11,

title:"Byte to Integer Conversion",

difficulty:"medium",

xp:60,

statement:
`Read a byte value and convert it into an integer.

Print the converted integer value.`,

inputFormat:
`A single byte value.`,

outputFormat:
`Converted integer.`,

constraints:
`-128 ≤ N ≤ 127`,

examples:[
{
input:`100`,
output:`100`,
explanation:`A byte value can be stored inside an int without explicit casting.`
}
],

runTestCases:[
{
input:`50`,
output:`50`
},
{
input:`-10`,
output:`-10`
}
],

hiddenTestCases:[
{
input:`127`,
output:`127`
},
{
input:`-128`,
output:`-128`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["byte","int","Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:12,

title:"Float Precision Comparison",

difficulty:"medium",

xp:65,

statement:
`Read a float value.

Print the value rounded to two decimal places.

This demonstrates floating-point precision.`,

inputFormat:
`A float value.`,

outputFormat:
`Rounded float.`,

constraints:
`0 ≤ Value ≤ 100000`,

examples:[
{
input:`3.141592`,
output:`3.14`
}
],

runTestCases:[
{
input:`15.6789`,
output:`15.68`
},
{
input:`8.999`,
output:`9.00`
}
],

hiddenTestCases:[
{
input:`123.45678`,
output:`123.46`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["float","Formatting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:13,

title:"Find Largest Primitive Data Type",

difficulty:"medium",

xp:70,

statement:
`Print the Java primitive data type capable of storing the largest integer value.

Output only the datatype name.`,

inputFormat:
`No input.`,

outputFormat:
`Datatype name.`,

constraints:
`None`,

examples:[
{
input:``,
output:`long`
}
],

runTestCases:[
{
input:``,
output:`long`
}
],

hiddenTestCases:[
{
input:``,
output:`long`
}
],

starterCode:{

java:
`public class Main{

public static void main(String[] args){

//Print the answer

}

}`

},

tags:["Primitive","Java"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:14,

title:"Memory Usage of Primitive Data Types",

difficulty:"hard",

xp:80,

statement:
`Read the name of a primitive data type.

Print the memory occupied by it in bytes.

Supported datatypes:

byte
short
int
long
float
double
char
boolean`,

inputFormat:
`Datatype name.`,

outputFormat:
`Memory in bytes.`,

constraints:
`Datatype is always valid.`,

examples:[
{
input:`int`,
output:`4`
}
],

runTestCases:[
{
input:`byte`,
output:`1`
},
{
input:`double`,
output:`8`
}
],

hiddenTestCases:[
{
input:`char`,
output:`2`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["Primitive","Memory"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:15,

title:"Safe Type Conversion",

difficulty:"hard",

xp:90,

statement:
`Read a long value.

If it fits inside an int, print:

Safe

Otherwise print:

Overflow`,

inputFormat:
`A long integer.`,

outputFormat:
`Safe or Overflow.`,

constraints:
`-9223372036854775808 ≤ N ≤ 9223372036854775807`,

examples:[
{
input:`100`,
output:`Safe`
},
{
input:`3000000000`,
output:`Overflow`
}
],

runTestCases:[
{
input:`2147483647`,
output:`Safe`
},
{
input:`2147483648`,
output:`Overflow`
}
],

hiddenTestCases:[
{
input:`-2147483649`,
output:`Overflow`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["Casting","Overflow"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},
//-------------------------------------------------------

{
id:11,

title:"Byte to Integer Conversion",

difficulty:"medium",

xp:60,

statement:
`Read a byte value and convert it into an integer.

Print the converted integer value.`,

inputFormat:
`A single byte value.`,

outputFormat:
`Converted integer.`,

constraints:
`-128 ≤ N ≤ 127`,

examples:[
{
input:`100`,
output:`100`,
explanation:`A byte value can be stored inside an int without explicit casting.`
}
],

runTestCases:[
{
input:`50`,
output:`50`
},
{
input:`-10`,
output:`-10`
}
],

hiddenTestCases:[
{
input:`127`,
output:`127`
},
{
input:`-128`,
output:`-128`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["byte","int","Casting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:12,

title:"Float Precision Comparison",

difficulty:"medium",

xp:65,

statement:
`Read a float value.

Print the value rounded to two decimal places.

This demonstrates floating-point precision.`,

inputFormat:
`A float value.`,

outputFormat:
`Rounded float.`,

constraints:
`0 ≤ Value ≤ 100000`,

examples:[
{
input:`3.141592`,
output:`3.14`
}
],

runTestCases:[
{
input:`15.6789`,
output:`15.68`
},
{
input:`8.999`,
output:`9.00`
}
],

hiddenTestCases:[
{
input:`123.45678`,
output:`123.46`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["float","Formatting"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:13,

title:"Find Largest Primitive Data Type",

difficulty:"medium",

xp:70,

statement:
`Print the Java primitive data type capable of storing the largest integer value.

Output only the datatype name.`,

inputFormat:
`No input.`,

outputFormat:
`Datatype name.`,

constraints:
`None`,

examples:[
{
input:``,
output:`long`
}
],

runTestCases:[
{
input:``,
output:`long`
}
],

hiddenTestCases:[
{
input:``,
output:`long`
}
],

starterCode:{

java:
`public class Main{

public static void main(String[] args){

//Print the answer

}

}`

},

tags:["Primitive","Java"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:14,

title:"Memory Usage of Primitive Data Types",

difficulty:"hard",

xp:80,

statement:
`Read the name of a primitive data type.

Print the memory occupied by it in bytes.

Supported datatypes:

byte
short
int
long
float
double
char
boolean`,

inputFormat:
`Datatype name.`,

outputFormat:
`Memory in bytes.`,

constraints:
`Datatype is always valid.`,

examples:[
{
input:`int`,
output:`4`
}
],

runTestCases:[
{
input:`byte`,
output:`1`
},
{
input:`double`,
output:`8`
}
],

hiddenTestCases:[
{
input:`char`,
output:`2`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["Primitive","Memory"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:15,

title:"Safe Type Conversion",

difficulty:"hard",

xp:90,

statement:
`Read a long value.

If it fits inside an int, print:

Safe

Otherwise print:

Overflow`,

inputFormat:
`A long integer.`,

outputFormat:
`Safe or Overflow.`,

constraints:
`-9223372036854775808 ≤ N ≤ 9223372036854775807`,

examples:[
{
input:`100`,
output:`Safe`
},
{
input:`3000000000`,
output:`Overflow`
}
],

runTestCases:[
{
input:`2147483647`,
output:`Safe`
},
{
input:`2147483648`,
output:`Overflow`
}
],

hiddenTestCases:[
{
input:`-2147483649`,
output:`Overflow`
}
],

starterCode:{

java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`

},

tags:["Casting","Overflow"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},
//-------------------------------------------------------

{
id:16,

title:"Temperature Converter Using Float",

difficulty:"hard",

xp:100,

statement:
`Read the temperature in Celsius as a float.

Convert it to Fahrenheit using the formula:

F = (C × 9/5) + 32

Print the result rounded to two decimal places.`,

inputFormat:
`A floating point number representing Celsius.`,

outputFormat:
`Temperature in Fahrenheit.`,

constraints:
`-100.0 ≤ C ≤ 100.0`,

examples:[
{
input:`37.0`,
output:`98.60`,
explanation:`(37 × 9/5) + 32 = 98.60`
}
],

runTestCases:[
{
input:`0`,
output:`32.00`
},
{
input:`100`,
output:`212.00`
}
],

hiddenTestCases:[
{
input:`25.5`,
output:`77.90`
}
],

starterCode:{
java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`
},

tags:["float","Conversion"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:17,

title:"Student Record Using Mixed Data Types",

difficulty:"hard",

xp:110,

statement:
`Read a student's Name, Roll Number, Marks and Grade.

Print the details exactly as given.

Use appropriate Java data types for each input.`,

inputFormat:
`String
Integer
Double
Character`,

outputFormat:
`Name
Roll Number
Marks
Grade`,

constraints:
`Marks are between 0 and 100.`,

examples:[
{
input:
`Rahul
101
91.5
A`,

output:
`Rahul
101
91.5
A`
}
],

runTestCases:[
{
input:
`Anu
15
88.25
B`,
output:
`Anu
15
88.25
B`
}
],

hiddenTestCases:[
{
input:
`David
220
76.50
C`,
output:
`David
220
76.50
C`
}
],

starterCode:{
java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`
},

tags:["String","double","char"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:18,

title:"Bank Account Information",

difficulty:"hard",

xp:120,

statement:
`Read the following details:

Account Number

Account Holder Name

Balance

Print all the values in the same order.

Use suitable Java data types.`,

inputFormat:
`Long
String
Double`,

outputFormat:
`Account Number
Name
Balance`,

constraints:
`Balance ≥ 0`,

examples:[
{
input:
`12345678901
John
25000.75`,

output:
`12345678901
John
25000.75`
}
],

runTestCases:[
{
input:
`9876543210
Alice
1500.50`,
output:
`9876543210
Alice
1500.50`
}
],

hiddenTestCases:[
{
input:
`1000000001
Bob
999999.99`,
output:
`1000000001
Bob
999999.99`
}
],

starterCode:{
java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`
},

tags:["long","String","double"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:19,

title:"Employee Payroll",

difficulty:"hard",

xp:130,

statement:
`Read Employee ID, Name, Basic Salary and Bonus.

Calculate Total Salary.

Total Salary = Basic Salary + Bonus

Print Employee ID, Name and Total Salary.`,

inputFormat:
`Integer
String
Double
Double`,

outputFormat:
`Employee ID
Employee Name
Total Salary`,

constraints:
`Salary > 0`,

examples:[
{
input:
`101
Rahul
25000
5000`,

output:
`101
Rahul
30000.00`
}
],

runTestCases:[
{
input:
`201
David
40000
7000`,
output:
`201
David
47000.00`
}
],

hiddenTestCases:[
{
input:
`301
Alex
15000
1500`,
output:
`301
Alex
16500.00`
}
],

starterCode:{
java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`
},

tags:["Payroll","double"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

},

//-------------------------------------------------------

{
id:20,

title:"Mini Shopping Bill",

difficulty:"hard",

xp:150,

statement:
`Read the following values:

Product Name

Quantity

Price per Item

GST Percentage

Calculate:

Subtotal = Quantity × Price

GST Amount

Final Amount

Print the Final Amount rounded to two decimal places.`,

inputFormat:
`String
Integer
Double
Double`,

outputFormat:
`Final Amount`,

constraints:
`Quantity > 0`,

examples:[
{
input:
`Laptop
2
50000
18`,

output:
`118000.00`
}
],

runTestCases:[
{
input:
`Book
5
200
5`,
output:
`1050.00`
},
{
input:
`Mouse
2
500
18`,
output:
`1180.00`
}
],

hiddenTestCases:[
{
input:
`Keyboard
3
1500
12`,
output:
`5040.00`
}
],

starterCode:{
java:
`import java.util.*;

public class Main{

public static void main(String[] args){

Scanner sc=new Scanner(System.in);

//Write your code

}

}`
},

tags:["Billing","double","GST"],

timeLimit:"1 sec",

memoryLimit:"256 MB"

}


],

operators:[
  {
  id: 1,
  language: "java",
  concept: "operators",
  difficulty: "easy",
  xp: 20,

  title: "Arithmetic Calculator",

  statement:
    "Read two integers A and B. Print their Sum, Difference, Product, Quotient and Remainder.",

  inputFormat:
    "Two integers A and B.",

  outputFormat:
    "Print Sum, Difference, Product, Quotient and Remainder each on a new line.",

  sampleInput: `10
3`,

  sampleOutput: `13
7
30
3
1`,

  constraints:
    "1 ≤ A, B ≤ 10000",

  explanation:
    "Use arithmetic operators (+, -, *, / and %) to perform the required calculations.",

  examples: [
    {
      input: `10
3`,
      output: `13
7
30
3
1`,
      explanation: "10+3=13, 10-3=7, 10*3=30, 10/3=3, 10%3=1"
    }
  ],

  runTestCases: [
    {
      input: `8
2`,
      output: `10
6
16
4
0`
    },
    {
      input: `25
4`,
      output: `29
21
100
6
1`
    }
  ],

  hiddenTestCases: [
    {
      input: `100
9`,
      output: `109
91
900
11
1`
    }
  ],

  starterCode: `import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Arithmetic","Operators"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 2. Even or Odd
// =======================

{
  id:2,
  language:"java",
  concept:"operators",
  difficulty:"easy",
  xp:25,

  title:"Even or Odd",

  statement:
  "Read an integer and determine whether it is Even or Odd using the modulus operator.",

  inputFormat:"One integer.",

  outputFormat:"Print Even or Odd.",

  sampleInput:`18`,

  sampleOutput:`Even`,

  constraints:"-100000 ≤ N ≤ 100000",

  explanation:
  "If N % 2 == 0 print Even otherwise print Odd.",

  examples:[
    {
      input:`15`,
      output:`Odd`,
      explanation:"15 is not divisible by 2."
    }
  ],

  runTestCases:[
    {
      input:`8`,
      output:`Even`
    },
    {
      input:`21`,
      output:`Odd`
    }
  ],

  hiddenTestCases:[
    {
      input:`100`,
      output:`Even`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Modulus","Arithmetic"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 3. Maximum of Two Numbers
// =======================

{
  id:3,
  language:"java",
  concept:"operators",
  difficulty:"easy",
  xp:30,

  title:"Maximum of Two Numbers",

  statement:
  "Read two integers and print the larger number using relational operators.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Largest integer.",

  sampleInput:`15
22`,

  sampleOutput:`22`,

  constraints:
  "-100000 ≤ A,B ≤ 100000",

  explanation:
  "Use > operator to compare both numbers.",

  examples:[
    {
      input:`6
4`,
      output:`6`
    }
  ],

  runTestCases:[
    {
      input:`10
20`,
      output:`20`
    },
    {
      input:`50
12`,
      output:`50`
    }
  ],

  hiddenTestCases:[
    {
      input:`-8
-2`,
      output:`-2`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Comparison","Relational"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 4. Swap Two Numbers
// =======================

{
  id:4,
  language:"java",
  concept:"operators",
  difficulty:"medium",
  xp:45,

  title:"Swap Two Numbers Without Third Variable",

  statement:
  "Read two integers and swap them without using a third variable.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Print the swapped numbers.",

  sampleInput:`5
8`,

  sampleOutput:`8
5`,

  constraints:
  "-100000 ≤ A,B ≤100000",

  explanation:
  "Use arithmetic operators (+ and -) to swap the numbers.",

  examples:[
    {
      input:`10
20`,
      output:`20
10`
    }
  ],

  runTestCases:[
    {
      input:`2
9`,
      output:`9
2`
    },
    {
      input:`15
40`,
      output:`40
15`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
50`,
      output:`50
100`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Arithmetic","Swap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 5. Increment and Decrement
// =======================

{
  id:5,
  language:"java",
  concept:"operators",
  difficulty:"medium",
  xp:50,

  title:"Increment and Decrement",

  statement:
  "Read an integer N. Print the value after pre-increment, post-increment, pre-decrement and post-decrement operations.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Print four values on separate lines.",

  sampleInput:`5`,

  sampleOutput:`6
6
5
5`,

  constraints:
  "-100000 ≤ N ≤100000",

  explanation:
  "Understand the difference between prefix and postfix increment/decrement operators.",

  examples:[
    {
      input:`10`,
      output:`11
11
10
10`
    }
  ],

  runTestCases:[
    {
      input:`15`,
      output:`16
16
15
15`
    },
    {
      input:`1`,
      output:`2
2
1
1`
    }
  ],

  hiddenTestCases:[
    {
      input:`99`,
      output:`100
100
99
99`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Increment","Decrement"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Login Validation
// =======================

{
  id:6,
  language:"java",
  concept:"operators",
  difficulty:"medium",
  xp:55,

  title:"Login Validation",

  statement:
  "Read two boolean values representing usernameValid and passwordValid. Print 'Login Successful' if both are true. Otherwise print 'Access Denied'.",

  inputFormat:
  "Two boolean values.",

  outputFormat:
  "Login Successful or Access Denied.",

  sampleInput:`true
true`,

  sampleOutput:`Login Successful`,

  constraints:
  "Input values are either true or false.",

  explanation:
  "Use the logical AND (&&) operator to check whether both values are true.",

  examples:[
    {
      input:`true
false`,
      output:`Access Denied`,
      explanation:"Both values must be true."
    }
  ],

  runTestCases:[
    {
      input:`false
true`,
      output:`Access Denied`
    },
    {
      input:`true
true`,
      output:`Login Successful`
    }
  ],

  hiddenTestCases:[
    {
      input:`false
false`,
      output:`Access Denied`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Logical Operators","Boolean"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 7. Voting Eligibility
// =======================

{
  id:7,
  language:"java",
  concept:"operators",
  difficulty:"medium",
  xp:60,

  title:"Voting Eligibility",

  statement:
  "Read the age of a person. Print 'Eligible' if age is greater than or equal to 18, otherwise print 'Not Eligible'.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Eligible or Not Eligible.",

  sampleInput:`20`,

  sampleOutput:`Eligible`,

  constraints:
  "1 ≤ Age ≤ 120",

  explanation:
  "Use relational operators to compare the age with 18.",

  examples:[
    {
      input:`16`,
      output:`Not Eligible`
    }
  ],

  runTestCases:[
    {
      input:`18`,
      output:`Eligible`
    },
    {
      input:`25`,
      output:`Eligible`
    }
  ],

  hiddenTestCases:[
    {
      input:`17`,
      output:`Not Eligible`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Relational Operators"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 8. Bitwise AND
// =======================

{
  id:8,
  language:"java",
  concept:"operators",
  difficulty:"hard",
  xp:75,

  title:"Bitwise AND",

  statement:
  "Read two integers and print the result of the Bitwise AND operator.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Bitwise AND value.",

  sampleInput:`6
3`,

  sampleOutput:`2`,

  constraints:
  "0 ≤ Numbers ≤ 100000",

  explanation:
  "The '&' operator compares each bit of the two numbers.",

  examples:[
    {
      input:`10
12`,
      output:`8`
    }
  ],

  runTestCases:[
    {
      input:`7
5`,
      output:`5`
    },
    {
      input:`15
8`,
      output:`8`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
50`,
      output:`32`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Bitwise Operators"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 9. Bitwise XOR
// =======================

{
  id:9,
  language:"java",
  concept:"operators",
  difficulty:"hard",
  xp:85,

  title:"Bitwise XOR",

  statement:
  "Read two integers and print their Bitwise XOR value.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Bitwise XOR result.",

  sampleInput:`5
3`,

  sampleOutput:`6`,

  constraints:
  "0 ≤ Numbers ≤ 100000",

  explanation:
  "The '^' operator returns 1 when corresponding bits are different.",

  examples:[
    {
      input:`8
4`,
      output:`12`
    }
  ],

  runTestCases:[
    {
      input:`10
5`,
      output:`15`
    },
    {
      input:`9
6`,
      output:`15`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
55`,
      output:`83`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Bitwise Operators"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 10. Expression Evaluation
// =======================

{
  id:10,
  language:"java",
  concept:"operators",
  difficulty:"hard",
  xp:100,

  title:"Expression Evaluation",

  statement:
  "Read three integers A, B and C. Evaluate the expression ((A + B) * C) - (A % C) and print the result.",

  inputFormat:
  "Three integers.",

  outputFormat:
  "Expression result.",

  sampleInput:`5
3
4`,

  sampleOutput:`32`,

  constraints:
  "1 ≤ Values ≤ 10000",

  explanation:
  "Use arithmetic operators and operator precedence to evaluate the expression.",

  examples:[
    {
      input:`10
5
2`,
      output:`30`
    }
  ],

  runTestCases:[
    {
      input:`8
2
5`,
      output:`50`
    },
    {
      input:`20
10
3`,
      output:`89`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
50
10`,
      output:`1500`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Arithmetic","Operator Precedence"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],

conditionalStatements:[
  // =======================
// 1. Positive, Negative or Zero
// =======================

{
  id:1,
  language:"java",
  concept:"conditional-statements",
  difficulty:"easy",
  xp:20,

  title:"Positive, Negative or Zero",

  statement:
  "Read an integer N. Print 'Positive' if N > 0, 'Negative' if N < 0 and 'Zero' if N == 0.",

  inputFormat:"One integer.",

  outputFormat:"Positive, Negative or Zero.",

  sampleInput:`15`,

  sampleOutput:`Positive`,

  constraints:"-100000 ≤ N ≤ 100000",

  explanation:"Use if-else statements to determine the sign of the number.",

  examples:[
    {
      input:`-5`,
      output:`Negative`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`Zero`
    },
    {
      input:`10`,
      output:`Positive`
    }
  ],

  hiddenTestCases:[
    {
      input:`-100`,
      output:`Negative`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Even or Odd
// =======================

{
  id:2,
  language:"java",
  concept:"conditional-statements",
  difficulty:"easy",
  xp:25,

  title:"Even or Odd",

  statement:
  "Read an integer and determine whether it is Even or Odd.",

  inputFormat:"One integer.",

  outputFormat:"Even or Odd.",

  sampleInput:`18`,

  sampleOutput:`Even`,

  constraints:"-100000 ≤ N ≤ 100000",

  explanation:"Use if-else with modulus operator.",

  examples:[
    {
      input:`9`,
      output:`Odd`
    }
  ],

  runTestCases:[
    {
      input:`20`,
      output:`Even`
    }
  ],

  hiddenTestCases:[
    {
      input:`31`,
      output:`Odd`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 3. Largest of Two Numbers
// =======================

{
  id:3,
  language:"java",
  concept:"conditional-statements",
  difficulty:"easy",
  xp:30,

  title:"Largest of Two Numbers",

  statement:
  "Read two integers and print the larger number.",

  inputFormat:"Two integers.",

  outputFormat:"Largest number.",

  sampleInput:`10
20`,

  sampleOutput:`20`,

  constraints:"-100000 ≤ A,B ≤ 100000",

  explanation:"Compare both values using if-else.",

  examples:[
    {
      input:`40
12`,
      output:`40`
    }
  ],

  runTestCases:[
    {
      input:`15
30`,
      output:`30`
    }
  ],

  hiddenTestCases:[
    {
      input:`-5
-2`,
      output:`-2`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Comparison"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 4. Largest of Three Numbers
// =======================

{
  id:4,
  language:"java",
  concept:"conditional-statements",
  difficulty:"medium",
  xp:40,

  title:"Largest of Three Numbers",

  statement:
  "Read three integers and print the largest number.",

  inputFormat:"Three integers.",

  outputFormat:"Largest number.",

  sampleInput:`5
15
10`,

  sampleOutput:`15`,

  constraints:"-100000 ≤ Numbers ≤ 100000",

  explanation:"Use nested if or else-if ladder.",

  examples:[
    {
      input:`20
30
25`,
      output:`30`
    }
  ],

  runTestCases:[
    {
      input:`50
45
40`,
      output:`50`
    }
  ],

  hiddenTestCases:[
    {
      input:`-1
-5
-2`,
      output:`-1`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Nested If"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Leap Year Checker
// =======================

{
  id:5,
  language:"java",
  concept:"conditional-statements",
  difficulty:"medium",
  xp:50,

  title:"Leap Year Checker",

  statement:
  "Read a year and determine whether it is a Leap Year or Not.",

  inputFormat:"Year.",

  outputFormat:"Leap Year or Not Leap Year.",

  sampleInput:`2024`,

  sampleOutput:`Leap Year`,

  constraints:"1900 ≤ Year ≤ 3000",

  explanation:"A leap year is divisible by 400 or divisible by 4 but not by 100.",

  examples:[
    {
      input:`2023`,
      output:`Not Leap Year`
    }
  ],

  runTestCases:[
    {
      input:`2000`,
      output:`Leap Year`
    }
  ],

  hiddenTestCases:[
    {
      input:`1900`,
      output:`Not Leap Year`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else","Leap Year"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Grade Calculator
// =======================

{
  id:6,
  language:"java",
  concept:"conditional-statements",
  difficulty:"medium",
  xp:60,

  title:"Grade Calculator",

  statement:
  "Read the marks of a student (0-100). Assign grades using the following criteria:\nA: 90-100\nB: 80-89\nC: 70-79\nD: 60-69\nF: Below 60.",

  inputFormat:"One integer representing marks.",

  outputFormat:"Print the corresponding grade.",

  sampleInput:`92`,

  sampleOutput:`A`,

  constraints:"0 ≤ Marks ≤ 100",

  explanation:"Use an if-else-if ladder to determine the correct grade.",

  examples:[
    {
      input:`75`,
      output:`C`
    }
  ],

  runTestCases:[
    {
      input:`88`,
      output:`B`
    },
    {
      input:`59`,
      output:`F`
    }
  ],

  hiddenTestCases:[
    {
      input:`100`,
      output:`A`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else","Grades"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 7. Voting Eligibility
// =======================

{
  id:7,
  language:"java",
  concept:"conditional-statements",
  difficulty:"medium",
  xp:65,

  title:"Voting Eligibility",

  statement:
  "Read the age of a person. Print 'Eligible' if age is 18 or above, otherwise print 'Not Eligible'.",

  inputFormat:"One integer.",

  outputFormat:"Eligible or Not Eligible.",

  sampleInput:`20`,

  sampleOutput:`Eligible`,

  constraints:"1 ≤ Age ≤ 120",

  explanation:"Use a simple if-else statement.",

  examples:[
    {
      input:`17`,
      output:`Not Eligible`
    }
  ],

  runTestCases:[
    {
      input:`18`,
      output:`Eligible`
    },
    {
      input:`35`,
      output:`Eligible`
    }
  ],

  hiddenTestCases:[
    {
      input:`16`,
      output:`Not Eligible`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 8. Income Tax Calculator
// =======================

{
  id:8,
  language:"java",
  concept:"conditional-statements",
  difficulty:"hard",
  xp:80,

  title:"Income Tax Calculator",

  statement:
  "Read the annual income and calculate the tax.\n\nIncome ≤ 250000 → 0%\n250001–500000 → 5%\n500001–1000000 → 20%\nAbove 1000000 → 30%\n\nPrint only the tax amount.",

  inputFormat:"One integer representing annual income.",

  outputFormat:"Tax amount.",

  sampleInput:`600000`,

  sampleOutput:`120000`,

  constraints:"1 ≤ Income ≤ 10000000",

  explanation:"Use an if-else-if ladder to determine the correct tax slab.",

  examples:[
    {
      input:`200000`,
      output:`0`
    }
  ],

  runTestCases:[
    {
      input:`400000`,
      output:`20000`
    },
    {
      input:`1200000`,
      output:`360000`
    }
  ],

  hiddenTestCases:[
    {
      input:`500000`,
      output:`25000`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["If Else","Tax"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 9. Simple Calculator using Switch
// =======================

{
  id:9,
  language:"java",
  concept:"conditional-statements",
  difficulty:"hard",
  xp:90,

  title:"Simple Calculator",

  statement:
  "Read two integers and an operator (+, -, *, /, %). Perform the corresponding operation using a switch statement.",

  inputFormat:"Integer\nOperator\nInteger",

  outputFormat:"Calculated result.",

  sampleInput:`10
+
5`,

  sampleOutput:`15`,

  constraints:"Division by zero will not occur.",

  explanation:"Use Java switch-case to perform arithmetic operations.",

  examples:[
    {
      input:`20
*
3`,
      output:`60`
    }
  ],

  runTestCases:[
    {
      input:`15
-
4`,
      output:`11`
    },
    {
      input:`25
%
7`,
      output:`4`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
/
5`,
      output:`20`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Switch Case"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 10. Electricity Bill Calculator
// =======================

{
  id:10,
  language:"java",
  concept:"conditional-statements",
  difficulty:"hard",
  xp:100,

  title:"Electricity Bill Calculator",

  statement:
  "Read the number of electricity units consumed.\n\nCalculate the bill using:\n\nFirst 100 units → ₹2/unit\nNext 100 units → ₹3/unit\nRemaining units → ₹5/unit\n\nPrint the total bill.",

  inputFormat:"One integer representing units consumed.",

  outputFormat:"Total electricity bill.",

  sampleInput:`250`,

  sampleOutput:`750`,

  constraints:"1 ≤ Units ≤ 10000",

  explanation:"Use nested if-else statements to calculate the bill slab-wise.",

  examples:[
    {
      input:`90`,
      output:`180`
    }
  ],

  runTestCases:[
    {
      input:`150`,
      output:`350`
    },
    {
      input:`300`,
      output:`900`
    }
  ],

  hiddenTestCases:[
    {
      input:`100`,
      output:`200`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){

    }
}`,

  tags:["Nested If","Billing"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}


],

loops:[
  // =======================
// 1. Print Numbers from 1 to N
// =======================

{
  id:1,
  language:"java",
  concept:"loops",
  difficulty:"easy",
  xp:20,

  title:"Print Numbers from 1 to N",

  statement:
  "Given an integer N, print all numbers from 1 to N, each on a new line.",

  inputFormat:"A single integer N.",

  outputFormat:"Print numbers from 1 to N.",

  sampleInput:`5`,

  sampleOutput:`1
2
3
4
5`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use a for loop starting from 1 and continue until N.",

  examples:[
    {
      input:`3`,
      output:`1
2
3`
    }
  ],

  runTestCases:[
    {
      input:`1`,
      output:`1`
    },
    {
      input:`7`,
      output:`1
2
3
4
5
6
7`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`1
2
3
4
5
6
7
8
9
10`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["For Loop"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 2. Sum of First N Numbers
// =======================

{
  id:2,
  language:"java",
  concept:"loops",
  difficulty:"easy",
  xp:30,

  title:"Sum of First N Numbers",

  statement:
  "Read an integer N. Find and print the sum of numbers from 1 to N.",

  inputFormat:"A single integer.",

  outputFormat:"Print the sum.",

  sampleInput:`5`,

  sampleOutput:`15`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use a loop to add all numbers from 1 to N.",

  examples:[
    {
      input:`4`,
      output:`10`
    }
  ],

  runTestCases:[
    {
      input:`10`,
      output:`55`
    },
    {
      input:`1`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`100`,
      output:`5050`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["For Loop","Summation"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 3. Multiplication Table
// =======================

{
  id:3,
  language:"java",
  concept:"loops",
  difficulty:"easy",
  xp:35,

  title:"Multiplication Table",

  statement:
  "Given an integer N, print its multiplication table from 1 to 10.",

  inputFormat:"One integer.",

  outputFormat:"Print multiplication table.",

  sampleInput:`5`,

  sampleOutput:`5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50`,

  constraints:
  "1 ≤ N ≤ 100",

  explanation:
  "Use a loop from 1 to 10.",

  examples:[
    {
      input:`2`,
      output:`2 x 1 = 2
...
2 x 10 = 20`
    }
  ],

  runTestCases:[
    {
      input:`7`,
      output:`7 x 1 = 7`
    }
  ],

  hiddenTestCases:[
    {
      input:`9`,
      output:`9 x 10 = 90`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Loop","Pattern"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 4. Factorial of a Number
// =======================

{
  id:4,
  language:"java",
  concept:"loops",
  difficulty:"medium",
  xp:50,

  title:"Factorial of a Number",

  statement:
  "Read an integer N and calculate its factorial.",

  inputFormat:"One integer.",

  outputFormat:"Print N!.",

  sampleInput:`5`,

  sampleOutput:`120`,

  constraints:
  "0 ≤ N ≤ 20",

  explanation:
  "Multiply numbers from 1 to N using a loop.",

  examples:[
    {
      input:`4`,
      output:`24`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`1`
    },
    {
      input:`6`,
      output:`720`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`3628800`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Factorial","Loop"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 5. Reverse a Number
// =======================

{
  id:5,
  language:"java",
  concept:"loops",
  difficulty:"medium",
  xp:60,

  title:"Reverse a Number",

  statement:
  "Read an integer N and print its reverse.",

  inputFormat:"One integer.",

  outputFormat:"Reversed number.",

  sampleInput:`12345`,

  sampleOutput:`54321`,

  constraints:
  "0 ≤ N ≤ 2147483647",

  explanation:
  "Extract digits using modulus operator and build the reversed number.",

  examples:[
    {
      input:`987`,
      output:`789`
    }
  ],

  runTestCases:[
    {
      input:`100`,
      output:`1`
    },
    {
      input:`1203`,
      output:`3021`
    }
  ],

  hiddenTestCases:[
    {
      input:`99999`,
      output:`99999`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Digits","Loop"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Palindrome Number
// =======================

{
  id:6,
  language:"java",
  concept:"loops",
  difficulty:"medium",
  xp:70,

  title:"Palindrome Number",

  statement:
  "Given an integer N, determine whether it is a palindrome. A palindrome number reads the same forward and backward.",

  inputFormat:"A single integer.",

  outputFormat:"Print 'Palindrome' or 'Not Palindrome'.",

  sampleInput:`121`,

  sampleOutput:`Palindrome`,

  constraints:
  "0 ≤ N ≤ 2147483647",

  explanation:
  "Reverse the number using a loop and compare it with the original number.",

  examples:[
    {
      input:`123`,
      output:`Not Palindrome`
    }
  ],

  runTestCases:[
    {
      input:`1001`,
      output:`Palindrome`
    },
    {
      input:`456`,
      output:`Not Palindrome`
    }
  ],

  hiddenTestCases:[
    {
      input:`99999`,
      output:`Palindrome`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Palindrome","Loop"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 7. Prime Number Checker
// =======================

{
  id:7,
  language:"java",
  concept:"loops",
  difficulty:"medium",
  xp:80,

  title:"Prime Number Checker",

  statement:
  "Given an integer N, determine whether it is Prime or Not Prime.",

  inputFormat:"One integer.",

  outputFormat:"Prime or Not Prime.",

  sampleInput:`17`,

  sampleOutput:`Prime`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Check divisibility from 2 to √N.",

  examples:[
    {
      input:`10`,
      output:`Not Prime`
    }
  ],

  runTestCases:[
    {
      input:`2`,
      output:`Prime`
    },
    {
      input:`49`,
      output:`Not Prime`
    }
  ],

  hiddenTestCases:[
    {
      input:`97`,
      output:`Prime`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Prime","Math"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 8. Fibonacci Series
// =======================

{
  id:8,
  language:"java",
  concept:"loops",
  difficulty:"hard",
  xp:90,

  title:"Fibonacci Series",

  statement:
  "Read an integer N and print the first N Fibonacci numbers.",

  inputFormat:"One integer.",

  outputFormat:"Fibonacci Series.",

  sampleInput:`5`,

  sampleOutput:`0 1 1 2 3`,

  constraints:
  "1 ≤ N ≤ 45",

  explanation:
  "Generate Fibonacci numbers using iteration.",

  examples:[
    {
      input:`7`,
      output:`0 1 1 2 3 5 8`
    }
  ],

  runTestCases:[
    {
      input:`1`,
      output:`0`
    },
    {
      input:`6`,
      output:`0 1 1 2 3 5`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`0 1 1 2 3 5 8 13 21 34`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Fibonacci"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 9. Armstrong Number
// =======================

{
  id:9,
  language:"java",
  concept:"loops",
  difficulty:"hard",
  xp:100,

  title:"Armstrong Number",

  statement:
  "Given a 3-digit integer N, determine whether it is an Armstrong number.",

  inputFormat:"One integer.",

  outputFormat:"Armstrong or Not Armstrong.",

  sampleInput:`153`,

  sampleOutput:`Armstrong`,

  constraints:
  "100 ≤ N ≤ 999",

  explanation:
  "Find the cube of each digit and add them. If the sum equals the original number, it is an Armstrong number.",

  examples:[
    {
      input:`370`,
      output:`Armstrong`
    }
  ],

  runTestCases:[
    {
      input:`371`,
      output:`Armstrong`
    },
    {
      input:`123`,
      output:`Not Armstrong`
    }
  ],

  hiddenTestCases:[
    {
      input:`407`,
      output:`Armstrong`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Armstrong","Digits"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 10. Count Digits and Sum of Digits
// =======================

{
  id:10,
  language:"java",
  concept:"loops",
  difficulty:"hard",
  xp:110,

  title:"Count Digits and Sum of Digits",

  statement:
  "Read an integer N. Print the total number of digits followed by the sum of its digits.",

  inputFormat:"One integer.",

  outputFormat:"Digit Count and Digit Sum.",

  sampleInput:`12345`,

  sampleOutput:`5
15`,

  constraints:
  "0 ≤ N ≤ 2147483647",

  explanation:
  "Extract each digit using modulus and division while counting digits and calculating their sum.",

  examples:[
    {
      input:`999`,
      output:`3
27`
    }
  ],

  runTestCases:[
    {
      input:`100`,
      output:`3
1`
    },
    {
      input:`7`,
      output:`1
7`
    }
  ],

  hiddenTestCases:[
    {
      input:`987654`,
      output:`6
39`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Digits","Loop"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],

arrays:[
  // =======================
// 1. Find Maximum Element
// =======================

{
  id:1,
  language:"java",
  concept:"arrays",
  difficulty:"easy",
  xp:20,

  title:"Find Maximum Element",

  statement:
  "Given an array of N integers, find and print the maximum element.",

  inputFormat:
  "First line contains N.\nSecond line contains N space-separated integers.",

  outputFormat:
  "Print the maximum element.",

  sampleInput:`5
2 8 1 9 4`,

  sampleOutput:`9`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the array and keep track of the largest value.",

  examples:[
    {
      input:`4
10 20 5 15`,
      output:`20`
    }
  ],

  runTestCases:[
    {
      input:`3
1 2 3`,
      output:`3`
    },
    {
      input:`5
9 8 7 6 5`,
      output:`9`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
100 200 150 99 98 250`,
      output:`250`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Traversal"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 2. Find Minimum Element
// =======================

{
  id:2,
  language:"java",
  concept:"arrays",
  difficulty:"easy",
  xp:25,

  title:"Find Minimum Element",

  statement:
  "Given an array of N integers, print the smallest element.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Print minimum element.",

  sampleInput:`5
5 7 1 9 2`,

  sampleOutput:`1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the array and update the minimum value.",

  examples:[
    {
      input:`4
8 3 10 6`,
      output:`3`
    }
  ],

  runTestCases:[
    {
      input:`5
20 30 10 50 60`,
      output:`10`
    }
  ],

  hiddenTestCases:[
    {
      input:`4
-2 -5 -1 -8`,
      output:`-8`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 3. Sum of Array Elements
// =======================

{
  id:3,
  language:"java",
  concept:"arrays",
  difficulty:"easy",
  xp:30,

  title:"Sum of Array Elements",

  statement:
  "Given an array of integers, calculate and print the sum of all elements.",

  inputFormat:
  "N followed by N integers.",

  outputFormat:
  "Print the sum.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`15`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use a loop to add every array element.",

  examples:[
    {
      input:`3
10 20 30`,
      output:`60`
    }
  ],

  runTestCases:[
    {
      input:`4
2 2 2 2`,
      output:`8`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
100 200 300 400 500`,
      output:`1500`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Summation"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 4. Second Largest Element
// =======================

{
  id:4,
  language:"java",
  concept:"arrays",
  difficulty:"medium",
  xp:45,

  title:"Second Largest Element",

  statement:
  "Given an array of integers, print the second largest distinct element.",

  inputFormat:
  "N followed by N integers.",

  outputFormat:
  "Print the second largest element.",

  sampleInput:`5
10 20 40 30 50`,

  sampleOutput:`40`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Traverse the array while maintaining largest and second largest values.",

  examples:[
    {
      input:`4
5 8 2 6`,
      output:`6`
    }
  ],

  runTestCases:[
    {
      input:`5
100 200 150 180 250`,
      output:`200`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
5 4 3 2 1 6`,
      output:`5`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 5. Reverse an Array
// =======================

{
  id:5,
  language:"java",
  concept:"arrays",
  difficulty:"medium",
  xp:55,

  title:"Reverse an Array",

  statement:
  "Given an array of integers, reverse the array and print the elements.",

  inputFormat:
  "N followed by N integers.",

  outputFormat:
  "Print reversed array.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`5 4 3 2 1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Swap elements from both ends until the middle is reached.",

  examples:[
    {
      input:`4
10 20 30 40`,
      output:`40 30 20 10`
    }
  ],

  runTestCases:[
    {
      input:`3
7 8 9`,
      output:`9 8 7`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
1 3 5 7 9 11`,
      output:`11 9 7 5 3 1`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Two Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Check if Array is Sorted
// =======================

{
  id:6,
  language:"java",
  concept:"arrays",
  difficulty:"medium",
  xp:65,

  title:"Check if Array is Sorted",

  statement:
  "Given an array of N integers, determine whether the array is sorted in non-decreasing order.",

  inputFormat:
  "First line contains N.\nSecond line contains N space-separated integers.",

  outputFormat:
  "Print Sorted or Not Sorted.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`Sorted`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the array once. If any element is smaller than its previous element, print Not Sorted.",

  examples:[
    {
      input:`5
1 5 3 4 2`,
      output:`Not Sorted`
    }
  ],

  runTestCases:[
    {
      input:`4
2 4 6 8`,
      output:`Sorted`
    },
    {
      input:`4
8 6 4 2`,
      output:`Not Sorted`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
10 10 20 20 30 30`,
      output:`Sorted`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Traversal"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 7. Move Zeroes to End
// =======================

{
  id:7,
  language:"java",
  concept:"arrays",
  difficulty:"hard",
  xp:80,

  title:"Move Zeroes to End",

  statement:
  "Given an array, move all zeroes to the end while maintaining the relative order of the non-zero elements.",

  inputFormat:
  "N followed by N integers.",

  outputFormat:
  "Print the modified array.",

  sampleInput:`5
0 1 0 3 12`,

  sampleOutput:`1 3 12 0 0`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Shift all non-zero elements to the beginning and fill the remaining positions with zeroes.",

  examples:[
    {
      input:`4
1 0 2 0`,
      output:`1 2 0 0`
    }
  ],

  runTestCases:[
    {
      input:`6
0 0 1 2 3 4`,
      output:`1 2 3 4 0 0`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
1 2 3 4 5`,
      output:`1 2 3 4 5`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Two Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 8. Remove Duplicates from Sorted Array
// =======================

{
  id:8,
  language:"java",
  concept:"arrays",
  difficulty:"hard",
  xp:90,

  title:"Remove Duplicates from Sorted Array",

  statement:
  "Given a sorted array, remove duplicate elements in-place and print the number of unique elements.",

  inputFormat:
  "N followed by N sorted integers.",

  outputFormat:
  "Print the count of unique elements.",

  sampleInput:`6
1 1 2 2 3 4`,

  sampleOutput:`4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use two pointers to overwrite duplicate elements.",

  examples:[
    {
      input:`5
1 1 1 2 3`,
      output:`3`
    }
  ],

  runTestCases:[
    {
      input:`7
2 2 2 3 4 4 5`,
      output:`4`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 5 5 5 5`,
      output:`1`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Two Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 9. Rotate Array by K Positions
// =======================

{
  id:9,
  language:"java",
  concept:"arrays",
  difficulty:"hard",
  xp:100,

  title:"Rotate Array by K Positions",

  statement:
  "Given an array and an integer K, rotate the array to the right by K positions.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.\nThird line contains K.",

  outputFormat:
  "Print the rotated array.",

  sampleInput:`5
1 2 3 4 5
2`,

  sampleOutput:`4 5 1 2 3`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use the reverse-array technique to rotate efficiently.",

  examples:[
    {
      input:`4
10 20 30 40
1`,
      output:`40 10 20 30`
    }
  ],

  runTestCases:[
    {
      input:`6
1 2 3 4 5 6
3`,
      output:`4 5 6 1 2 3`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 4 3 2 1
5`,
      output:`5 4 3 2 1`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Rotation"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 10. Two Sum
// =======================

{
  id:10,
  language:"java",
  concept:"arrays",
  difficulty:"hard",
  xp:120,

  title:"Two Sum",

  statement:
  "Given an array of integers and a target value, determine whether two different elements add up to the target. Print 'YES' if such a pair exists, otherwise print 'NO'.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.\nThird line contains Target.",

  outputFormat:
  "YES or NO.",

  sampleInput:`4
2 7 11 15
9`,

  sampleOutput:`YES`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Use a HashSet or HashMap to find the complement of each element in O(N) time.",

  examples:[
    {
      input:`5
1 2 3 4 5
10`,
      output:`NO`
    }
  ],

  runTestCases:[
    {
      input:`5
5 1 9 6 2
7`,
      output:`YES`
    },
    {
      input:`4
10 20 30 40
15`,
      output:`NO`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
3 8 12 4 6 9
15`,
      output:`YES`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Arrays","Hashing","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},


],

strings:[
  // =======================
// 1. String Length
// =======================

{
  id:1,
  language:"java",
  concept:"strings",
  difficulty:"easy",
  xp:20,

  title:"String Length",

  statement:
  "Given a string S, print the length of the string.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Print the length of the string.",

  sampleInput:`SkillQuest`,

  sampleOutput:`10`,

  constraints:
  "1 ≤ Length of S ≤ 1000",

  explanation:
  "Use the length() method to determine the number of characters.",

  examples:[
    {
      input:`Java`,
      output:`4`
    }
  ],

  runTestCases:[
    {
      input:`Hello`,
      output:`5`
    },
    {
      input:`Programming`,
      output:`11`
    }
  ],

  hiddenTestCases:[
    {
      input:`OpenAI`,
      output:`6`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 2. Reverse a String
// =======================

{
  id:2,
  language:"java",
  concept:"strings",
  difficulty:"easy",
  xp:30,

  title:"Reverse a String",

  statement:
  "Given a string S, print the string in reverse order.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Reversed string.",

  sampleInput:`hello`,

  sampleOutput:`olleh`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Traverse the string from the last character to the first.",

  examples:[
    {
      input:`Java`,
      output:`avaJ`
    }
  ],

  runTestCases:[
    {
      input:`Coding`,
      output:`gnidoC`
    }
  ],

  hiddenTestCases:[
    {
      input:`SkillQuest`,
      output:`tseuQllikS`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Strings","Reverse"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 3. Palindrome String
// =======================

{
  id:3,
  language:"java",
  concept:"strings",
  difficulty:"easy",
  xp:40,

  title:"Palindrome String",

  statement:
  "Given a string S, determine whether it is a palindrome.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Print Palindrome or Not Palindrome.",

  sampleInput:`madam`,

  sampleOutput:`Palindrome`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Compare characters from both ends of the string.",

  examples:[
    {
      input:`level`,
      output:`Palindrome`
    }
  ],

  runTestCases:[
    {
      input:`java`,
      output:`Not Palindrome`
    }
  ],

  hiddenTestCases:[
    {
      input:`racecar`,
      output:`Palindrome`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Strings","Palindrome"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 4. Count Vowels and Consonants
// =======================

{
  id:4,
  language:"java",
  concept:"strings",
  difficulty:"medium",
  xp:55,

  title:"Count Vowels and Consonants",

  statement:
  "Given a string S containing only alphabets, count the number of vowels and consonants.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Print vowel count followed by consonant count.",

  sampleInput:`education`,

  sampleOutput:`5
4`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Traverse the string and classify each alphabet as a vowel or consonant.",

  examples:[
    {
      input:`apple`,
      output:`2
3`
    }
  ],

  runTestCases:[
    {
      input:`skill`,
      output:`1
4`
    }
  ],

  hiddenTestCases:[
    {
      input:`programming`,
      output:`3
8`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Strings","Counting"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 5. Check Anagram
// =======================

{
  id:5,
  language:"java",
  concept:"strings",
  difficulty:"medium",
  xp:70,

  title:"Check Anagram",

  statement:
  "Given two strings, determine whether they are anagrams of each other. Ignore letter case.",

  inputFormat:
  "First string.\nSecond string.",

  outputFormat:
  "Print Anagram or Not Anagram.",

  sampleInput:`listen
silent`,

  sampleOutput:`Anagram`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Two strings are anagrams if they contain the same characters with the same frequency.",

  examples:[
    {
      input:`evil
vile`,
      output:`Anagram`
    }
  ],

  runTestCases:[
    {
      input:`hello
world`,
      output:`Not Anagram`
    }
  ],

  hiddenTestCases:[
    {
      input:`Triangle
Integral`,
      output:`Anagram`
    }
  ],

  starterCode:`import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        // Write your code

    }
}`,

  tags:["Strings","Sorting","HashMap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Remove Spaces from String
// =======================

{
  id:6,
  language:"java",
  concept:"strings",
  difficulty:"medium",
  xp:80,

  title:"Remove Spaces from String",

  statement:
  "Given a string S, remove all spaces from the string and print the modified string.",

  inputFormat:
  "A single string.",

  outputFormat:
  "String without spaces.",

  sampleInput:`Hello World`,

  sampleOutput:`HelloWorld`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Traverse the string and ignore whitespace characters.",

  examples:[
    {
      input:`Java Programming`,
      output:`JavaProgramming`
    }
  ],

  runTestCases:[
    {
      input:`Open AI`,
      output:`OpenAI`
    }
  ],

  hiddenTestCases:[
    {
      input:`Skill Quest Platform`,
      output:`SkillQuestPlatform`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 7. First Non-Repeating Character
// =======================

{
  id:7,
  language:"java",
  concept:"strings",
  difficulty:"hard",
  xp:90,

  title:"First Non-Repeating Character",

  statement:
  "Given a string S, print the first non-repeating character. If none exists, print -1.",

  inputFormat:
  "A single string.",

  outputFormat:
  "First non-repeating character or -1.",

  sampleInput:`leetcode`,

  sampleOutput:`l`,

  constraints:
  "1 ≤ Length ≤ 100000",

  explanation:
  "Count the frequency of every character and find the first character with frequency one.",

  examples:[
    {
      input:`aabb`,
      output:`-1`
    }
  ],

  runTestCases:[
    {
      input:`swiss`,
      output:`w`
    }
  ],

  hiddenTestCases:[
    {
      input:`programming`,
      output:`p`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Strings","HashMap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 8. Longest Common Prefix
// LeetCode #14
// =======================

{
  id:8,
  language:"java",
  concept:"strings",
  difficulty:"hard",
  xp:100,

  title:"Longest Common Prefix",

  statement:
  "Given an array of strings, return the longest common prefix among all strings. If there is no common prefix, print an empty string.",

  inputFormat:
  "First line contains N.\nNext N lines contain strings.",

  outputFormat:
  "Longest common prefix.",

  sampleInput:`3
flower
flow
flight`,

  sampleOutput:`fl`,

  constraints:
  "1 ≤ N ≤ 200",

  explanation:
  "Compare characters from left to right until a mismatch occurs.",

  examples:[
    {
      input:`3
dog
racecar
car`,
      output:``
    }
  ],

  runTestCases:[
    {
      input:`3
apple
application
apply`,
      output:`appl`
    }
  ],

  hiddenTestCases:[
    {
      input:`4
interview
internet
internal
interval`,
      output:`inter`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Strings","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 9. Valid Parentheses
// LeetCode #20
// =======================

{
  id:9,
  language:"java",
  concept:"strings",
  difficulty:"hard",
  xp:110,

  title:"Valid Parentheses",

  statement:
  "Given a string containing only '(', ')', '{', '}', '[' and ']', determine whether the parentheses are valid.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Print Valid or Invalid.",

  sampleInput:`()[]{}`,

  sampleOutput:`Valid`,

  constraints:
  "1 ≤ Length ≤ 10000",

  explanation:
  "Use a stack to match opening and closing brackets.",

  examples:[
    {
      input:`([)]`,
      output:`Invalid`
    }
  ],

  runTestCases:[
    {
      input:`((()))`,
      output:`Valid`
    }
  ],

  hiddenTestCases:[
    {
      input:`{[()]}`,
      output:`Valid`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Stack","Strings","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}

  

  

],

methods:[
  // =======================
// 1. Add Two Numbers using Method
// =======================

{
  id:1,
  language:"java",
  concept:"methods",
  difficulty:"easy",
  xp:20,

  title:"Add Two Numbers using Method",

  statement:
  "Write a method add(int a, int b) that returns the sum of two integers.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Print the sum.",

  sampleInput:`10
20`,

  sampleOutput:`30`,

  constraints:
  "-100000 ≤ A,B ≤ 100000",

  explanation:
  "Create a method that accepts two integers and returns their sum.",

  examples:[
    {
      input:`5
7`,
      output:`12`
    }
  ],

  runTestCases:[
    {
      input:`15
30`,
      output:`45`
    }
  ],

  hiddenTestCases:[
    {
      input:`-5
5`,
      output:`0`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static int add(int a,int b){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Functions"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Find Maximum using Method
// =======================

{
  id:2,
  language:"java",
  concept:"methods",
  difficulty:"easy",
  xp:30,

  title:"Find Maximum using Method",

  statement:
  "Write a method max(int a, int b) that returns the larger of two numbers.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Largest number.",

  sampleInput:`15
25`,

  sampleOutput:`25`,

  constraints:
  "-100000 ≤ A,B ≤ 100000",

  explanation:
  "Create a method that compares two integers and returns the larger value.",

  examples:[
    {
      input:`20
10`,
      output:`20`
    }
  ],

  runTestCases:[
    {
      input:`99
100`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`-5
-2`,
      output:`-2`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static int max(int a,int b){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Check Even or Odd using Method
// =======================

{
  id:3,
  language:"java",
  concept:"methods",
  difficulty:"easy",
  xp:40,

  title:"Check Even or Odd using Method",

  statement:
  "Write a method isEven(int n) that returns true if the number is even, otherwise false.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Print Even or Odd.",

  sampleInput:`18`,

  sampleOutput:`Even`,

  constraints:
  "-100000 ≤ N ≤ 100000",

  explanation:
  "Return true if n is divisible by 2.",

  examples:[
    {
      input:`7`,
      output:`Odd`
    }
  ],

  runTestCases:[
    {
      input:`100`,
      output:`Even`
    }
  ],

  hiddenTestCases:[
    {
      input:`25`,
      output:`Odd`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static boolean isEven(int n){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Boolean"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Factorial using Method
// =======================

{
  id:4,
  language:"java",
  concept:"methods",
  difficulty:"medium",
  xp:55,

  title:"Factorial using Method",

  statement:
  "Write a method factorial(int n) that returns the factorial of a number.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Factorial.",

  sampleInput:`5`,

  sampleOutput:`120`,

  constraints:
  "0 ≤ N ≤ 20",

  explanation:
  "Implement the factorial logic inside a separate method and return the result.",

  examples:[
    {
      input:`4`,
      output:`24`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`3628800`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static long factorial(int n){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Loops"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Prime Number using Method
// =======================

{
  id:5,
  language:"java",
  concept:"methods",
  difficulty:"medium",
  xp:70,

  title:"Prime Number using Method",

  statement:
  "Write a method isPrime(int n) that returns true if the given number is prime.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Print Prime or Not Prime.",

  sampleInput:`17`,

  sampleOutput:`Prime`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Create a separate method to determine whether the number is prime.",

  examples:[
    {
      input:`20`,
      output:`Not Prime`
    }
  ],

  runTestCases:[
    {
      input:`29`,
      output:`Prime`
    }
  ],

  hiddenTestCases:[
    {
      input:`97`,
      output:`Prime`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static boolean isPrime(int n){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Prime"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Method Overloading
// =======================

{
  id:6,
  language:"java",
  concept:"methods",
  difficulty:"medium",
  xp:80,

  title:"Method Overloading",

  statement:
  "Create two overloaded methods named add(). One method should add two integers, and another should add three integers. Print the result based on the given input.",

  inputFormat:
  "First line contains an integer T (2 or 3).\nIf T=2, read two integers.\nIf T=3, read three integers.",

  outputFormat:
  "Print the sum.",

  sampleInput:`2
10 20`,

  sampleOutput:`30`,

  constraints:
  "-100000 ≤ Numbers ≤ 100000",

  explanation:
  "Use method overloading by creating multiple methods with the same name but different parameters.",

  examples:[
    {
      input:`3
5 10 15`,
      output:`30`
    }
  ],

  runTestCases:[
    {
      input:`2
7 8`,
      output:`15`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
100 200 300`,
      output:`600`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static int add(int a,int b){

    }

    static int add(int a,int b,int c){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Overloading"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Reverse String using Method
// =======================

{
  id:7,
  language:"java",
  concept:"methods",
  difficulty:"medium",
  xp:90,

  title:"Reverse String using Method",

  statement:
  "Write a method reverse(String s) that returns the reversed string.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Reversed string.",

  sampleInput:`hello`,

  sampleOutput:`olleh`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Create a separate method that reverses and returns the string.",

  examples:[
    {
      input:`Java`,
      output:`avaJ`
    }
  ],

  runTestCases:[
    {
      input:`Programming`,
      output:`gnimmargorP`
    }
  ],

  hiddenTestCases:[
    {
      input:`SkillQuest`,
      output:`tseuQllikS`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static String reverse(String s){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Find Average using Method
// =======================

{
  id:8,
  language:"java",
  concept:"methods",
  difficulty:"hard",
  xp:100,

  title:"Find Average using Method",

  statement:
  "Write a method average(int[] arr) that returns the average of all elements in an array.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Print the average up to two decimal places.",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`30.00`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Pass an array to a method and calculate the average.",

  examples:[
    {
      input:`4
2 4 6 8`,
      output:`5.00`
    }
  ],

  runTestCases:[
    {
      input:`3
5 10 15`,
      output:`10.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 200`,
      output:`150.00`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static double average(int arr[]){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Recursive Factorial
// =======================

{
  id:9,
  language:"java",
  concept:"methods",
  difficulty:"hard",
  xp:120,

  title:"Recursive Factorial",

  statement:
  "Write a recursive method factorial(int n) that returns the factorial of a number.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Factorial.",

  sampleInput:`5`,

  sampleOutput:`120`,

  constraints:
  "0 ≤ N ≤ 20",

  explanation:
  "Solve the problem using recursion instead of loops.",

  examples:[
    {
      input:`4`,
      output:`24`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`3628800`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static long factorial(int n){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Recursion"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Recursive Binary Search
// =======================

{
  id:10,
  language:"java",
  concept:"methods",
  difficulty:"hard",
  xp:140,

  title:"Recursive Binary Search",

  statement:
  "Given a sorted array and a target value, implement a recursive binary search method. Print the index if found; otherwise print -1.",

  inputFormat:
  "First line contains N.\nSecond line contains N sorted integers.\nThird line contains Target.",

  outputFormat:
  "Index of target or -1.",

  sampleInput:`5
2 4 6 8 10
8`,

  sampleOutput:`3`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Implement Binary Search using recursion.",

  examples:[
    {
      input:`6
1 3 5 7 9 11
4`,
      output:`-1`
    }
  ],

  runTestCases:[
    {
      input:`5
10 20 30 40 50
20`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`7
5 10 15 20 25 30 35
35`,
      output:`6`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static int binarySearch(int arr[],int low,int high,int target){

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Recursion","Binary Search"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],

oop:[
  // =======================
// 1. Create a Student Class
// =======================

{
  id:1,
  language:"java",
  concept:"oop",
  difficulty:"easy",
  xp:20,

  title:"Create a Student Class",

  statement:
  "Create a Student class with attributes id, name and marks. Read the values, create an object and print the details.",

  inputFormat:
  "Integer id\nString name\nDouble marks",

  outputFormat:
  "Print id, name and marks.",

  sampleInput:`101
John
89.5`,

  sampleOutput:`101
John
89.5`,

  constraints:
  "1 ≤ id ≤ 100000",

  explanation:
  "Create a Student object and access its data members.",

  examples:[
    {
      input:`102
Alice
95`,
      output:`102
Alice
95.0`
    }
  ],

  runTestCases:[
    {
      input:`201
David
78.5`,
      output:`201
David
78.5`
    }
  ],

  hiddenTestCases:[
    {
      input:`301
Emma
99.9`,
      output:`301
Emma
99.9`
    }
  ],

  starterCode:`import java.util.*;

class Student{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Class","Object"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employee Salary
// =======================

{
  id:2,
  language:"java",
  concept:"oop",
  difficulty:"easy",
  xp:30,

  title:"Employee Salary",

  statement:
  "Create an Employee class with name and salary. Read the values and print them using an object.",

  inputFormat:
  "String name\nDouble salary",

  outputFormat:
  "Employee details.",

  sampleInput:`Rahul
45000`,

  sampleOutput:`Rahul
45000.0`,

  constraints:
  "Salary > 0",

  explanation:
  "Create an object and assign values to its fields.",

  examples:[
    {
      input:`John
50000`,
      output:`John
50000.0`
    }
  ],

  runTestCases:[
    {
      input:`Priya
70000`,
      output:`Priya
70000.0`
    }
  ],

  hiddenTestCases:[
    {
      input:`Alex
99999`,
      output:`Alex
99999.0`
    }
  ],

  starterCode:`import java.util.*;

class Employee{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Object"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Area using Constructor
// =======================

{
  id:3,
  language:"java",
  concept:"oop",
  difficulty:"medium",
  xp:45,

  title:"Area using Constructor",

  statement:
  "Create a Rectangle class with length and breadth. Initialize them using a constructor and print the area.",

  inputFormat:
  "Length\nBreadth",

  outputFormat:
  "Area",

  sampleInput:`10
5`,

  sampleOutput:`50`,

  constraints:
  "1 ≤ Length,Breadth ≤ 10000",

  explanation:
  "Initialize object values using a constructor.",

  examples:[
    {
      input:`4
6`,
      output:`24`
    }
  ],

  runTestCases:[
    {
      input:`8
7`,
      output:`56`
    }
  ],

  hiddenTestCases:[
    {
      input:`20
20`,
      output:`400`
    }
  ],

  starterCode:`import java.util.*;

class Rectangle{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Constructor"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Bank Account Deposit
// =======================

{
  id:4,
  language:"java",
  concept:"oop",
  difficulty:"medium",
  xp:60,

  title:"Bank Account Deposit",

  statement:
  "Create a BankAccount class with balance. Implement a deposit() method that updates the balance.",

  inputFormat:
  "Initial Balance\nDeposit Amount",

  outputFormat:
  "Updated Balance.",

  sampleInput:`5000
2500`,

  sampleOutput:`7500`,

  constraints:
  "Balance ≥ 0",

  explanation:
  "Use methods inside a class to update object state.",

  examples:[
    {
      input:`1000
500`,
      output:`1500`
    }
  ],

  runTestCases:[
    {
      input:`700
300`,
      output:`1000`
    }
  ],

  hiddenTestCases:[
    {
      input:`10000
100`,
      output:`10100`
    }
  ],

  starterCode:`import java.util.*;

class BankAccount{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Methods","Objects"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Circle Class
// =======================

{
  id:5,
  language:"java",
  concept:"oop",
  difficulty:"medium",
  xp:75,

  title:"Circle Class",

  statement:
  "Create a Circle class with radius. Implement methods to calculate area and circumference.",

  inputFormat:
  "Radius",

  outputFormat:
  "Area\nCircumference",

  sampleInput:`7`,

  sampleOutput:`153.94
43.98`,

  constraints:
  "1 ≤ Radius ≤ 1000",

  explanation:
  "Create methods inside the class to perform calculations.",

  examples:[
    {
      input:`5`,
      output:`78.54
31.42`
    }
  ],

  runTestCases:[
    {
      input:`10`,
      output:`314.16
62.83`
    }
  ],

  hiddenTestCases:[
    {
      input:`15`,
      output:`706.86
94.25`
    }
  ],

  starterCode:`import java.util.*;

class Circle{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Class","Methods"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Constructor Overloading
// =======================

{
  id:6,
  language:"java",
  concept:"oop",
  difficulty:"medium",
  xp:85,

  title:"Constructor Overloading",

  statement:
  "Create a Student class with two constructors. One constructor initializes only the name, and the other initializes both name and age. Print the object details.",

  inputFormat:
  "First line contains name.\nSecond line contains age.",

  outputFormat:
  "Print name and age.",

  sampleInput:`John
21`,

  sampleOutput:`John
21`,

  constraints:
  "1 ≤ Age ≤ 120",

  explanation:
  "Implement constructor overloading by defining multiple constructors with different parameters.",

  examples:[
    {
      input:`Alice
19`,
      output:`Alice
19`
    }
  ],

  runTestCases:[
    {
      input:`David
25`,
      output:`David
25`
    }
  ],

  hiddenTestCases:[
    {
      input:`Emma
18`,
      output:`Emma
18`
    }
  ],

  starterCode:`import java.util.*;

class Student{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Constructor","Overloading"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Static Variable Counter
// =======================

{
  id:7,
  language:"java",
  concept:"oop",
  difficulty:"medium",
  xp:90,

  title:"Static Variable Counter",

  statement:
  "Create a class Employee with a static variable count. Every time an object is created, increment count. Print the total number of objects created.",

  inputFormat:
  "An integer N representing the number of Employee objects.",

  outputFormat:
  "Total number of objects.",

  sampleInput:`5`,

  sampleOutput:`5`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Static variables are shared among all objects.",

  examples:[
    {
      input:`3`,
      output:`3`
    }
  ],

  runTestCases:[
    {
      input:`10`,
      output:`10`
    }
  ],

  hiddenTestCases:[
    {
      input:`1`,
      output:`1`
    }
  ],

  starterCode:`import java.util.*;

class Employee{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Static","Objects"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Array of Objects
// =======================

{
  id:8,
  language:"java",
  concept:"oop",
  difficulty:"hard",
  xp:100,

  title:"Array of Objects",

  statement:
  "Create an array of Student objects. Read student details and print the name of the student with the highest marks.",

  inputFormat:
  "First line contains N.\nNext N lines contain name and marks.",

  outputFormat:
  "Print the topper's name.",

  sampleInput:`3
John 85
Alice 95
David 90`,

  sampleOutput:`Alice`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Store Student objects inside an array and traverse to find the highest scorer.",

  examples:[
    {
      input:`2
Tom 60
Jerry 80`,
      output:`Jerry`
    }
  ],

  runTestCases:[
    {
      input:`3
A 50
B 75
C 65`,
      output:`B`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
Emma 99
Sophia 98`,
      output:`Emma`
    }
  ],

  starterCode:`import java.util.*;

class Student{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Objects","Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Copy Constructor
// =======================

{
  id:9,
  language:"java",
  concept:"oop",
  difficulty:"hard",
  xp:110,

  title:"Copy Constructor",

  statement:
  "Create a Student class with a copy constructor. Copy one object into another and print both objects.",

  inputFormat:
  "Student id\nStudent name",

  outputFormat:
  "Print original object followed by copied object.",

  sampleInput:`101
John`,

  sampleOutput:`101 John
101 John`,

  constraints:
  "1 ≤ id ≤ 100000",

  explanation:
  "A copy constructor initializes an object using another object of the same class.",

  examples:[
    {
      input:`202
Alice`,
      output:`202 Alice
202 Alice`
    }
  ],

  runTestCases:[
    {
      input:`303
David`,
      output:`303 David
303 David`
    }
  ],

  hiddenTestCases:[
    {
      input:`404
Emma`,
      output:`404 Emma
404 Emma`
    }
  ],

  starterCode:`import java.util.*;

class Student{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Constructor","Copy Constructor"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Library Management
// =======================

{
  id:10,
  language:"java",
  concept:"oop",
  difficulty:"hard",
  xp:130,

  title:"Library Management",

  statement:
  "Create Book and Library classes. Read book details, add books to the library and print the total number of books along with their titles.",

  inputFormat:
  "First line contains N.\nNext N lines contain book titles.",

  outputFormat:
  "Print total books followed by all titles.",

  sampleInput:`3
Java
Python
C++`,

  sampleOutput:`3
Java
Python
C++`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Demonstrates object interaction where one class manages objects of another class.",

  examples:[
    {
      input:`2
DBMS
OS`,
      output:`2
DBMS
OS`
    }
  ],

  runTestCases:[
    {
      input:`1
Networks`,
      output:`1
Networks`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
AI
ML`,
      output:`2
AI
ML`
    }
  ],

  starterCode:`import java.util.*;

class Book{

}

class Library{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["OOP","Classes","Objects"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],

inheritance:[
  // =======================
// 1. Student Inherits Person
// =======================

{
  id:1,
  language:"java",
  concept:"inheritance",
  difficulty:"easy",
  xp:20,

  title:"Student Inherits Person",

  statement:
  "Create a Person class with name and age. Create a Student class that inherits Person and prints the inherited details.",

  inputFormat:
  "String name\nInteger age",

  outputFormat:
  "Print name and age.",

  sampleInput:`John
20`,

  sampleOutput:`John
20`,

  constraints:
  "1 ≤ Age ≤ 120",

  explanation:
  "Use extends to inherit the Person class.",

  examples:[
    {
      input:`Alice
19`,
      output:`Alice
19`
    }
  ],

  runTestCases:[
    {
      input:`David
22`,
      output:`David
22`
    }
  ],

  hiddenTestCases:[
    {
      input:`Emma
18`,
      output:`Emma
18`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Student extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Inheritance","extends"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employee Salary using Inheritance
// =======================

{
  id:2,
  language:"java",
  concept:"inheritance",
  difficulty:"easy",
  xp:35,

  title:"Employee Salary using Inheritance",

  statement:
  "Create a Person class with name. Create an Employee class that inherits Person and contains salary. Print both values.",

  inputFormat:
  "Name\nSalary",

  outputFormat:
  "Name and Salary.",

  sampleInput:`Rahul
50000`,

  sampleOutput:`Rahul
50000`,

  constraints:
  "Salary > 0",

  explanation:
  "Access parent class members inside the child class.",

  examples:[
    {
      input:`Priya
70000`,
      output:`Priya
70000`
    }
  ],

  runTestCases:[
    {
      input:`Alex
60000`,
      output:`Alex
60000`
    }
  ],

  hiddenTestCases:[
    {
      input:`Tom
80000`,
      output:`Tom
80000`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Employee extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Inheritance"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Vehicle and Car
// =======================

{
  id:3,
  language:"java",
  concept:"inheritance",
  difficulty:"medium",
  xp:50,

  title:"Vehicle and Car",

  statement:
  "Create a Vehicle class containing brand. Create a Car class inheriting Vehicle with model. Print both values.",

  inputFormat:
  "Brand\nModel",

  outputFormat:
  "Brand and Model.",

  sampleInput:`Toyota
Fortuner`,

  sampleOutput:`Toyota
Fortuner`,

  constraints:
  "Brand and Model are non-empty.",

  explanation:
  "The child class inherits properties from the parent class.",

  examples:[
    {
      input:`Honda
City`,
      output:`Honda
City`
    }
  ],

  runTestCases:[
    {
      input:`Hyundai
Creta`,
      output:`Hyundai
Creta`
    }
  ],

  hiddenTestCases:[
    {
      input:`BMW
X5`,
      output:`BMW
X5`
    }
  ],

  starterCode:`import java.util.*;

class Vehicle{

}

class Car extends Vehicle{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Inheritance","Vehicle"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Multilevel Inheritance
// =======================

{
  id:4,
  language:"java",
  concept:"inheritance",
  difficulty:"medium",
  xp:65,

  title:"Multilevel Inheritance",

  statement:
  "Create Animal, Mammal and Dog classes using multilevel inheritance. Print the inherited methods.",

  inputFormat:
  "No input.",

  outputFormat:
  "Animal\nMammal\nDog",

  sampleInput:` `,

  sampleOutput:`Animal
Mammal
Dog`,

  constraints:
  "None",

  explanation:
  "Dog inherits Mammal, which inherits Animal.",

  examples:[
    {
      input:` `,
      output:`Animal
Mammal
Dog`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Animal
Mammal
Dog`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Animal
Mammal
Dog`
    }
  ],

  starterCode:`class Animal{

}

class Mammal extends Animal{

}

class Dog extends Mammal{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Multilevel"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Constructor Inheritance
// =======================

{
  id:5,
  language:"java",
  concept:"inheritance",
  difficulty:"medium",
  xp:80,

  title:"Constructor Inheritance",

  statement:
  "Create a Person class with a constructor that prints 'Person Constructor'. Create Student extending Person with its own constructor printing 'Student Constructor'.",

  inputFormat:
  "No input.",

  outputFormat:
  "Person Constructor\nStudent Constructor",

  sampleInput:` `,

  sampleOutput:`Person Constructor
Student Constructor`,

  constraints:
  "None",

  explanation:
  "Parent constructor executes before the child constructor.",

  examples:[
    {
      input:` `,
      output:`Person Constructor
Student Constructor`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Person Constructor
Student Constructor`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Person Constructor
Student Constructor`
    }
  ],

  starterCode:`class Person{

}

class Student extends Person{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Constructor","Inheritance"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Hierarchical Inheritance
// =======================

{
  id:6,
  language:"java",
  concept:"inheritance",
  difficulty:"medium",
  xp:90,

  title:"Hierarchical Inheritance",

  statement:
  "Create a Person class. Create Student and Teacher classes that inherit from Person. Print the details of both objects.",

  inputFormat:
  "Student Name\nTeacher Name",

  outputFormat:
  "Student Name\nTeacher Name",

  sampleInput:`John
David`,

  sampleOutput:`John
David`,

  constraints:
  "Names are non-empty.",

  explanation:
  "Two child classes inherit from the same parent class.",

  examples:[
    {
      input:`Alice
Emma`,
      output:`Alice
Emma`
    }
  ],

  runTestCases:[
    {
      input:`Tom
Jerry`,
      output:`Tom
Jerry`
    }
  ],

  hiddenTestCases:[
    {
      input:`Alex
Sophia`,
      output:`Alex
Sophia`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Student extends Person{

}

class Teacher extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Hierarchical Inheritance"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Using super Keyword
// =======================

{
  id:7,
  language:"java",
  concept:"inheritance",
  difficulty:"medium",
  xp:100,

  title:"Using super Keyword",

  statement:
  "Create a Person class with a name field. Create Student extending Person. Use the super keyword to initialize the parent's field and print the name.",

  inputFormat:
  "Student Name",

  outputFormat:
  "Student Name",

  sampleInput:`John`,

  sampleOutput:`John`,

  constraints:
  "Name is non-empty.",

  explanation:
  "Use super() to invoke the parent constructor.",

  examples:[
    {
      input:`Alice`,
      output:`Alice`
    }
  ],

  runTestCases:[
    {
      input:`David`,
      output:`David`
    }
  ],

  hiddenTestCases:[
    {
      input:`Emma`,
      output:`Emma`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Student extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["super","Constructor"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Access Parent Method
// =======================

{
  id:8,
  language:"java",
  concept:"inheritance",
  difficulty:"hard",
  xp:110,

  title:"Access Parent Method",

  statement:
  "Create an Animal class with a method sound(). Create Dog extending Animal and call the inherited method.",

  inputFormat:
  "No input.",

  outputFormat:
  "Animal Sound",

  sampleInput:` `,

  sampleOutput:`Animal Sound`,

  constraints:
  "None",

  explanation:
  "Child classes inherit methods from the parent class.",

  examples:[
    {
      input:` `,
      output:`Animal Sound`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Animal Sound`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Animal Sound`
    }
  ],

  starterCode:`class Animal{

}

class Dog extends Animal{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Methods","Inheritance"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Access Protected Members
// =======================

{
  id:9,
  language:"java",
  concept:"inheritance",
  difficulty:"hard",
  xp:120,

  title:"Access Protected Members",

  statement:
  "Create a Person class with a protected variable name. Access and print it inside the Student class.",

  inputFormat:
  "Student Name",

  outputFormat:
  "Student Name",

  sampleInput:`Rahul`,

  sampleOutput:`Rahul`,

  constraints:
  "Name is non-empty.",

  explanation:
  "Protected members can be accessed directly inside child classes.",

  examples:[
    {
      input:`Priya`,
      output:`Priya`
    }
  ],

  runTestCases:[
    {
      input:`Alex`,
      output:`Alex`
    }
  ],

  hiddenTestCases:[
    {
      input:`Emma`,
      output:`Emma`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Student extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["protected","Inheritance"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. School Management System
// =======================

{
  id:10,
  language:"java",
  concept:"inheritance",
  difficulty:"hard",
  xp:140,

  title:"School Management System",

  statement:
  "Create a Person class. Create Student and Teacher classes inheriting Person. Read their details and print them using inherited methods.",

  inputFormat:
  "Student Name\nStudent Age\nTeacher Name\nTeacher Age",

  outputFormat:
  "Student Details\nTeacher Details",

  sampleInput:`John
20
David
35`,

  sampleOutput:`John 20
David 35`,

  constraints:
  "Age > 0",

  explanation:
  "Demonstrates inheritance in a real-world school management scenario.",

  examples:[
    {
      input:`Alice
19
Emma
40`,
      output:`Alice 19
Emma 40`
    }
  ],

  runTestCases:[
    {
      input:`Tom
18
Jerry
38`,
      output:`Tom 18
Jerry 38`
    }
  ],

  hiddenTestCases:[
    {
      input:`Alex
21
Sophia
42`,
      output:`Alex 21
Sophia 42`
    }
  ],

  starterCode:`import java.util.*;

class Person{

}

class Student extends Person{

}

class Teacher extends Person{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Inheritance","Real World"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}

],

polymorphism:[
  // =======================
// 1. Method Overriding
// =======================

{
  id:1,
  language:"java",
  concept:"polymorphism",
  difficulty:"easy",
  xp:20,

  title:"Method Overriding",

  statement:
  "Create a Vehicle class with a method start(). Create a Car class that overrides start(). Print the overridden message.",

  inputFormat:
  "No input.",

  outputFormat:
  "Car Started",

  sampleInput:` `,

  sampleOutput:`Car Started`,

  constraints:
  "None",

  explanation:
  "Method overriding allows the child class to provide its own implementation of a parent class method.",

  examples:[
    {
      input:` `,
      output:`Car Started`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Car Started`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Car Started`
    }
  ],

  starterCode:`class Vehicle{

}

class Car extends Vehicle{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Method Overriding"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Runtime Polymorphism
// =======================

{
  id:2,
  language:"java",
  concept:"polymorphism",
  difficulty:"easy",
  xp:35,

  title:"Runtime Polymorphism",

  statement:
  "Create Animal and Dog classes. Use an Animal reference to call the Dog's overridden sound() method.",

  inputFormat:
  "No input.",

  outputFormat:
  "Dog Barks",

  sampleInput:` `,

  sampleOutput:`Dog Barks`,

  constraints:
  "None",

  explanation:
  "The method executed is determined at runtime.",

  examples:[
    {
      input:` `,
      output:`Dog Barks`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Dog Barks`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Dog Barks`
    }
  ],

  starterCode:`class Animal{

}

class Dog extends Animal{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Runtime Polymorphism"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Method Overloading
// =======================

{
  id:3,
  language:"java",
  concept:"polymorphism",
  difficulty:"medium",
  xp:50,

  title:"Method Overloading",

  statement:
  "Create a Calculator class with overloaded add() methods for two integers and three integers.",

  inputFormat:
  "First line contains T (2 or 3).\nRead numbers accordingly.",

  outputFormat:
  "Print the sum.",

  sampleInput:`3
10 20 30`,

  sampleOutput:`60`,

  constraints:
  "-100000 ≤ Numbers ≤ 100000",

  explanation:
  "Method overloading is an example of compile-time polymorphism.",

  examples:[
    {
      input:`2
5 8`,
      output:`13`
    }
  ],

  runTestCases:[
    {
      input:`3
1 2 3`,
      output:`6`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 200`,
      output:`300`
    }
  ],

  starterCode:`import java.util.*;

class Calculator{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Method Overloading"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Dynamic Method Dispatch
// =======================

{
  id:4,
  language:"java",
  concept:"polymorphism",
  difficulty:"medium",
  xp:65,

  title:"Dynamic Method Dispatch",

  statement:
  "Create Shape and Circle classes. Use a Shape reference to call Circle's overridden draw() method.",

  inputFormat:
  "No input.",

  outputFormat:
  "Drawing Circle",

  sampleInput:` `,

  sampleOutput:`Drawing Circle`,

  constraints:
  "None",

  explanation:
  "A parent reference can refer to a child object, and the overridden method is called at runtime.",

  examples:[
    {
      input:` `,
      output:`Drawing Circle`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Drawing Circle`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Drawing Circle`
    }
  ],

  starterCode:`class Shape{

}

class Circle extends Shape{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Dynamic Dispatch"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Payment Gateway
// =======================

{
  id:5,
  language:"java",
  concept:"polymorphism",
  difficulty:"medium",
  xp:80,

  title:"Payment Gateway",

  statement:
  "Create a Payment class with makePayment(). Create CreditCardPayment and UpiPayment classes that override the method. Call the appropriate payment method using a parent reference.",

  inputFormat:
  "Payment Type (Card/UPI)",

  outputFormat:
  "Payment Successful using selected method.",

  sampleInput:`UPI`,

  sampleOutput:`Payment Successful using UPI`,

  constraints:
  "Input is either Card or UPI.",

  explanation:
  "Real-world example of runtime polymorphism.",

  examples:[
    {
      input:`Card`,
      output:`Payment Successful using Card`
    }
  ],

  runTestCases:[
    {
      input:`UPI`,
      output:`Payment Successful using UPI`
    }
  ],

  hiddenTestCases:[
    {
      input:`Card`,
      output:`Payment Successful using Card`
    }
  ],

  starterCode:`import java.util.*;

class Payment{

}

class CreditCardPayment extends Payment{

}

class UpiPayment extends Payment{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Runtime Polymorphism","Overriding"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Banking System using Polymorphism
// =======================

{
  id:6,
  language:"java",
  concept:"polymorphism",
  difficulty:"medium",
  xp:90,

  title:"Banking System using Polymorphism",

  statement:
  "Create a Bank class with calculateInterest(). Create SBI and HDFC classes that override this method. Print the interest rate based on the selected bank.",

  inputFormat:
  "Bank Name (SBI/HDFC)",

  outputFormat:
  "Interest Rate",

  sampleInput:`SBI`,

  sampleOutput:`Interest Rate: 6.5%`,

  constraints:
  "Input is either SBI or HDFC.",

  explanation:
  "Use runtime polymorphism to invoke the appropriate implementation.",

  examples:[
    {
      input:`HDFC`,
      output:`Interest Rate: 7.0%`
    }
  ],

  runTestCases:[
    {
      input:`SBI`,
      output:`Interest Rate: 6.5%`
    }
  ],

  hiddenTestCases:[
    {
      input:`HDFC`,
      output:`Interest Rate: 7.0%`
    }
  ],

  starterCode:`import java.util.*;

class Bank{

}

class SBI extends Bank{

}

class HDFC extends Bank{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Runtime Polymorphism"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Employee Salary Calculator
// =======================

{
  id:7,
  language:"java",
  concept:"polymorphism",
  difficulty:"medium",
  xp:100,

  title:"Employee Salary Calculator",

  statement:
  "Create an Employee class with calculateSalary(). Create FullTimeEmployee and PartTimeEmployee classes that override the method.",

  inputFormat:
  "Employee Type (FullTime/PartTime)",

  outputFormat:
  "Calculated Salary",

  sampleInput:`FullTime`,

  sampleOutput:`50000`,

  constraints:
  "Input is valid.",

  explanation:
  "Each child class implements salary calculation differently.",

  examples:[
    {
      input:`PartTime`,
      output:`15000`
    }
  ],

  runTestCases:[
    {
      input:`FullTime`,
      output:`50000`
    }
  ],

  hiddenTestCases:[
    {
      input:`PartTime`,
      output:`15000`
    }
  ],

  starterCode:`import java.util.*;

class Employee{

}

class FullTimeEmployee extends Employee{

}

class PartTimeEmployee extends Employee{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Overriding","Polymorphism"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Shape Area Calculator
// =======================

{
  id:8,
  language:"java",
  concept:"polymorphism",
  difficulty:"hard",
  xp:110,

  title:"Shape Area Calculator",

  statement:
  "Create a Shape class with area(). Create Circle and Rectangle classes that override the area() method and print the calculated area.",

  inputFormat:
  "Shape Type (Circle/Rectangle)\nRequired dimensions",

  outputFormat:
  "Area",

  sampleInput:`Circle
5`,

  sampleOutput:`78.54`,

  constraints:
  "Dimensions > 0",

  explanation:
  "Different child classes calculate area differently using method overriding.",

  examples:[
    {
      input:`Rectangle
10
20`,
      output:`200`
    }
  ],

  runTestCases:[
    {
      input:`Circle
7`,
      output:`153.94`
    }
  ],

  hiddenTestCases:[
    {
      input:`Rectangle
5
8`,
      output:`40`
    }
  ],

  starterCode:`import java.util.*;

class Shape{

}

class Circle extends Shape{

}

class Rectangle extends Shape{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Runtime Polymorphism","Shape"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Zoo Animal Simulator
// =======================

{
  id:9,
  language:"java",
  concept:"polymorphism",
  difficulty:"hard",
  xp:120,

  title:"Zoo Animal Simulator",

  statement:
  "Create an Animal class with makeSound(). Create Lion, Tiger and Elephant classes that override the method. Print the sound based on the selected animal.",

  inputFormat:
  "Animal Name",

  outputFormat:
  "Animal Sound",

  sampleInput:`Lion`,

  sampleOutput:`Lion Roars`,

  constraints:
  "Animal is Lion, Tiger or Elephant.",

  explanation:
  "Use runtime polymorphism to call the correct overridden method.",

  examples:[
    {
      input:`Tiger`,
      output:`Tiger Growls`
    }
  ],

  runTestCases:[
    {
      input:`Elephant`,
      output:`Elephant Trumpets`
    }
  ],

  hiddenTestCases:[
    {
      input:`Lion`,
      output:`Lion Roars`
    }
  ],

  starterCode:`import java.util.*;

class Animal{

}

class Lion extends Animal{

}

class Tiger extends Animal{

}

class Elephant extends Animal{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Polymorphism","Animals"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Smart Home Device Controller
// =======================

{
  id:10,
  language:"java",
  concept:"polymorphism",
  difficulty:"hard",
  xp:140,

  title:"Smart Home Device Controller",

  statement:
  "Create a SmartDevice class with turnOn(). Create Light, Fan and AC classes that override turnOn(). Based on user input, invoke the correct overridden method using a parent reference.",

  inputFormat:
  "Device Name (Light/Fan/AC)",

  outputFormat:
  "Device Status",

  sampleInput:`Fan`,

  sampleOutput:`Fan Turned On`,

  constraints:
  "Input is one of Light, Fan or AC.",

  explanation:
  "This demonstrates dynamic method dispatch in a real-world smart home application.",

  examples:[
    {
      input:`Light`,
      output:`Light Turned On`
    }
  ],

  runTestCases:[
    {
      input:`AC`,
      output:`AC Turned On`
    }
  ],

  hiddenTestCases:[
    {
      input:`Fan`,
      output:`Fan Turned On`
    }
  ],

  starterCode:`import java.util.*;

class SmartDevice{

}

class Light extends SmartDevice{

}

class Fan extends SmartDevice{

}

class AC extends SmartDevice{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Dynamic Dispatch","Real World"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],
abstraction:[
  // =======================
// 1. Abstract Shape Class
// =======================

{
  id:1,
  language:"java",
  concept:"abstraction",
  difficulty:"easy",
  xp:20,

  title:"Abstract Shape Class",

  statement:
  "Create an abstract class Shape with an abstract method area(). Create a Circle class that implements the area() method and prints the area.",

  inputFormat:
  "Radius",

  outputFormat:
  "Area of Circle.",

  sampleInput:`5`,

  sampleOutput:`78.54`,

  constraints:
  "1 ≤ Radius ≤ 1000",

  explanation:
  "An abstract class cannot be instantiated. The child class must implement all abstract methods.",

  examples:[
    {
      input:`7`,
      output:`153.94`
    }
  ],

  runTestCases:[
    {
      input:`10`,
      output:`314.16`
    }
  ],

  hiddenTestCases:[
    {
      input:`15`,
      output:`706.86`
    }
  ],

  starterCode:`import java.util.*;

abstract class Shape{

}

class Circle extends Shape{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Class"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employee Salary
// =======================

{
  id:2,
  language:"java",
  concept:"abstraction",
  difficulty:"easy",
  xp:35,

  title:"Employee Salary",

  statement:
  "Create an abstract class Employee with calculateSalary(). Implement it in FullTimeEmployee.",

  inputFormat:
  "Monthly Salary",

  outputFormat:
  "Salary",

  sampleInput:`50000`,

  sampleOutput:`50000`,

  constraints:
  "Salary > 0",

  explanation:
  "Child classes provide the implementation of abstract methods.",

  examples:[
    {
      input:`65000`,
      output:`65000`
    }
  ],

  runTestCases:[
    {
      input:`80000`,
      output:`80000`
    }
  ],

  hiddenTestCases:[
    {
      input:`45000`,
      output:`45000`
    }
  ],

  starterCode:`import java.util.*;

abstract class Employee{

}

class FullTimeEmployee extends Employee{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Method"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Vehicle Engine
// =======================

{
  id:3,
  language:"java",
  concept:"abstraction",
  difficulty:"medium",
  xp:50,

  title:"Vehicle Engine",

  statement:
  "Create an abstract Vehicle class with startEngine(). Implement the method in Car class.",

  inputFormat:
  "No input.",

  outputFormat:
  "Car Engine Started",

  sampleInput:` `,

  sampleOutput:`Car Engine Started`,

  constraints:
  "None",

  explanation:
  "Abstract methods define behavior while subclasses provide implementation.",

  examples:[
    {
      input:` `,
      output:`Car Engine Started`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`Car Engine Started`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Car Engine Started`
    }
  ],

  starterCode:`abstract class Vehicle{

}

class Car extends Vehicle{

}

public class Main{

    public static void main(String[] args){

        // Write your code

    }

}`,

  tags:["Abstraction"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Bank Account
// =======================

{
  id:4,
  language:"java",
  concept:"abstraction",
  difficulty:"medium",
  xp:65,

  title:"Bank Account",

  statement:
  "Create an abstract class BankAccount with deposit() and withdraw() methods. Implement both methods in SavingsAccount.",

  inputFormat:
  "Initial Balance\nDeposit Amount\nWithdraw Amount",

  outputFormat:
  "Final Balance",

  sampleInput:`5000
2000
1000`,

  sampleOutput:`6000`,

  constraints:
  "Balance ≥ 0",

  explanation:
  "Abstract classes define the operations while subclasses implement them.",

  examples:[
    {
      input:`1000
500
200`,
      output:`1300`
    }
  ],

  runTestCases:[
    {
      input:`7000
500
100`,
      output:`7400`
    }
  ],

  hiddenTestCases:[
    {
      input:`10000
0
5000`,
      output:`5000`
    }
  ],

  starterCode:`import java.util.*;

abstract class BankAccount{

}

class SavingsAccount extends BankAccount{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Class","Bank"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Animal Sound
// =======================

{
  id:5,
  language:"java",
  concept:"abstraction",
  difficulty:"medium",
  xp:80,

  title:"Animal Sound",

  statement:
  "Create an abstract Animal class with makeSound(). Implement it in Dog and Cat classes.",

  inputFormat:
  "Animal Name (Dog/Cat)",

  outputFormat:
  "Corresponding Sound",

  sampleInput:`Dog`,

  sampleOutput:`Bark`,

  constraints:
  "Input is Dog or Cat.",

  explanation:
  "Different subclasses implement the same abstract method differently.",

  examples:[
    {
      input:`Cat`,
      output:`Meow`
    }
  ],

  runTestCases:[
    {
      input:`Dog`,
      output:`Bark`
    }
  ],

  hiddenTestCases:[
    {
      input:`Cat`,
      output:`Meow`
    }
  ],

  starterCode:`import java.util.*;

abstract class Animal{

}

class Dog extends Animal{

}

class Cat extends Animal{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Method","Animals"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Payment System using Abstract Class
// =======================

{
  id:6,
  language:"java",
  concept:"abstraction",
  difficulty:"medium",
  xp:90,

  title:"Payment System using Abstract Class",

  statement:
  "Create an abstract class Payment with an abstract method pay(). Implement the method in CreditCardPayment and UpiPayment classes.",

  inputFormat:
  "Payment Type (Card/UPI)",

  outputFormat:
  "Payment Successful",

  sampleInput:`UPI`,

  sampleOutput:`Payment Successful using UPI`,

  constraints:
  "Input is Card or UPI.",

  explanation:
  "Different payment methods provide different implementations of the same abstract method.",

  examples:[
    {
      input:`Card`,
      output:`Payment Successful using Card`
    }
  ],

  runTestCases:[
    {
      input:`UPI`,
      output:`Payment Successful using UPI`
    }
  ],

  hiddenTestCases:[
    {
      input:`Card`,
      output:`Payment Successful using Card`
    }
  ],

  starterCode:`import java.util.*;

abstract class Payment{

}

class CreditCardPayment extends Payment{

}

class UpiPayment extends Payment{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Class","Payment"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Notification System using Interface
// =======================

{
  id:7,
  language:"java",
  concept:"abstraction",
  difficulty:"medium",
  xp:100,

  title:"Notification System using Interface",

  statement:
  "Create an interface Notification with sendMessage(). Implement EmailNotification and SmsNotification classes.",

  inputFormat:
  "Notification Type (Email/SMS)",

  outputFormat:
  "Notification Sent",

  sampleInput:`Email`,

  sampleOutput:`Email Sent`,

  constraints:
  "Input is Email or SMS.",

  explanation:
  "Interfaces provide complete abstraction by declaring methods without implementation.",

  examples:[
    {
      input:`SMS`,
      output:`SMS Sent`
    }
  ],

  runTestCases:[
    {
      input:`Email`,
      output:`Email Sent`
    }
  ],

  hiddenTestCases:[
    {
      input:`SMS`,
      output:`SMS Sent`
    }
  ],

  starterCode:`import java.util.*;

interface Notification{

}

class EmailNotification implements Notification{

}

class SmsNotification implements Notification{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Interface"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Smart Home using Interface
// =======================

{
  id:8,
  language:"java",
  concept:"abstraction",
  difficulty:"hard",
  xp:110,

  title:"Smart Home using Interface",

  statement:
  "Create an interface SmartDevice with turnOn(). Implement Light, Fan and AC classes.",

  inputFormat:
  "Device Name",

  outputFormat:
  "Device Turned On",

  sampleInput:`Fan`,

  sampleOutput:`Fan Turned On`,

  constraints:
  "Input is Light, Fan or AC.",

  explanation:
  "Multiple classes implement the same interface differently.",

  examples:[
    {
      input:`Light`,
      output:`Light Turned On`
    }
  ],

  runTestCases:[
    {
      input:`AC`,
      output:`AC Turned On`
    }
  ],

  hiddenTestCases:[
    {
      input:`Fan`,
      output:`Fan Turned On`
    }
  ],

  starterCode:`import java.util.*;

interface SmartDevice{

}

class Light implements SmartDevice{

}

class Fan implements SmartDevice{

}

class AC implements SmartDevice{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Interface","Smart Home"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Online Shopping using Abstract Class
// =======================

{
  id:9,
  language:"java",
  concept:"abstraction",
  difficulty:"hard",
  xp:120,

  title:"Online Shopping using Abstract Class",

  statement:
  "Create an abstract Product class with calculateDiscount(). Implement ElectronicsProduct and ClothingProduct classes with different discount calculations.",

  inputFormat:
  "Product Type\nPrice",

  outputFormat:
  "Final Price after Discount",

  sampleInput:`Electronics
10000`,

  sampleOutput:`9000`,

  constraints:
  "Price > 0",

  explanation:
  "Each subclass calculates discounts differently while sharing the same abstract method.",

  examples:[
    {
      input:`Clothing
2000`,
      output:`1600`
    }
  ],

  runTestCases:[
    {
      input:`Electronics
5000`,
      output:`4500`
    }
  ],

  hiddenTestCases:[
    {
      input:`Clothing
3000`,
      output:`2400`
    }
  ],

  starterCode:`import java.util.*;

abstract class Product{

}

class ElectronicsProduct extends Product{

}

class ClothingProduct extends Product{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Class","Shopping"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. University Portal
// =======================

{
  id:10,
  language:"java",
  concept:"abstraction",
  difficulty:"hard",
  xp:140,

  title:"University Portal",

  statement:
  "Create an abstract class User with login(). Implement Student, Faculty and Admin classes that provide different login messages.",

  inputFormat:
  "User Type (Student/Faculty/Admin)",

  outputFormat:
  "Login Successful",

  sampleInput:`Student`,

  sampleOutput:`Student Login Successful`,

  constraints:
  "Input is Student, Faculty or Admin.",

  explanation:
  "Abstract classes define a common structure while subclasses provide specific behavior.",

  examples:[
    {
      input:`Faculty`,
      output:`Faculty Login Successful`
    }
  ],

  runTestCases:[
    {
      input:`Admin`,
      output:`Admin Login Successful`
    }
  ],

  hiddenTestCases:[
    {
      input:`Student`,
      output:`Student Login Successful`
    }
  ],

  starterCode:`import java.util.*;

abstract class User{

}

class Student extends User{

}

class Faculty extends User{

}

class Admin extends User{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Abstract Class","Real World"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],
collections:[
  // =======================
// 1. ArrayList - Store Student Names
// =======================

{
  id:1,
  language:"java",
  concept:"collections",
  difficulty:"easy",
  xp:20,

  title:"Store Student Names using ArrayList",

  statement:
  "Read N student names, store them in an ArrayList and print all names in the order they were entered.",

  inputFormat:
  "First line contains N.\nNext N lines contain student names.",

  outputFormat:
  "Print all student names.",

  sampleInput:`3
John
Alice
David`,

  sampleOutput:`John
Alice
David`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use ArrayList<String> to store and display student names.",

  examples:[
    {
      input:`2
Tom
Jerry`,
      output:`Tom
Jerry`
    }
  ],

  runTestCases:[
    {
      input:`1
Emma`,
      output:`Emma`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
Alex
Sophia`,
      output:`Alex
Sophia`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["ArrayList"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Remove Duplicate Elements using HashSet
// =======================

{
  id:2,
  language:"java",
  concept:"collections",
  difficulty:"easy",
  xp:35,

  title:"Remove Duplicate Elements",

  statement:
  "Read N integers and remove duplicate values using a HashSet. Print the unique elements.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Print unique elements.",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`1 2 3 4`,

  constraints:
  "1 ≤ N ≤ 10000",

  explanation:
  "HashSet automatically removes duplicate values.",

  examples:[
    {
      input:`5
5 5 6 6 7`,
      output:`5 6 7`
    }
  ],

  runTestCases:[
    {
      input:`4
10 20 20 30`,
      output:`10 20 30`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`9`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["HashSet"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Frequency of Elements using HashMap
// =======================

{
  id:3,
  language:"java",
  concept:"collections",
  difficulty:"medium",
  xp:50,

  title:"Frequency of Elements",

  statement:
  "Read N integers and print the frequency of each element using HashMap.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Element Frequency",

  sampleInput:`5
1 2 2 3 3`,

  sampleOutput:`1 1
2 2
3 2`,

  constraints:
  "1 ≤ N ≤ 10000",

  explanation:
  "HashMap stores element-frequency pairs.",

  examples:[
    {
      input:`4
5 5 5 7`,
      output:`5 3
7 1`
    }
  ],

  runTestCases:[
    {
      input:`3
8 8 9`,
      output:`8 2
9 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
10 10 20 20 20`,
      output:`10 2
20 3`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["HashMap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Stack Operations
// =======================

{
  id:4,
  language:"java",
  concept:"collections",
  difficulty:"medium",
  xp:65,

  title:"Stack Operations",

  statement:
  "Implement Stack operations. Read N integers, push them into a Stack, then print the top element and remove it.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Top Element\nRemaining Stack",

  sampleInput:`4
10 20 30 40`,

  sampleOutput:`40
10 20 30`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use Stack push(), peek() and pop() methods.",

  examples:[
    {
      input:`3
5 6 7`,
      output:`7
5 6`
    }
  ],

  runTestCases:[
    {
      input:`2
100 200`,
      output:`200
100`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
50`,
      output:`50`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Stack"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Queue Operations
// =======================

{
  id:5,
  language:"java",
  concept:"collections",
  difficulty:"medium",
  xp:80,

  title:"Queue Operations",

  statement:
  "Read N integers, insert them into a Queue and print the first element followed by the remaining queue after removing the first element.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Front Element\nRemaining Queue",

  sampleInput:`4
5 10 15 20`,

  sampleOutput:`5
10 15 20`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use Queue interface with LinkedList implementation.",

  examples:[
    {
      input:`3
1 2 3`,
      output:`1
2 3`
    }
  ],

  runTestCases:[
    {
      input:`2
50 60`,
      output:`50
60`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
99`,
      output:`99`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Queue","LinkedList"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Sort Student Marks using Collections.sort()
// =======================

{
  id:6,
  language:"java",
  concept:"collections",
  difficulty:"medium",
  xp:90,

  title:"Sort Student Marks",

  statement:
  "Read N student marks into an ArrayList. Sort the marks in ascending order using Collections.sort() and print them.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Sorted marks.",

  sampleInput:`5
45 78 12 98 65`,

  sampleOutput:`12 45 65 78 98`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Collections.sort() sorts an ArrayList in ascending order.",

  examples:[
    {
      input:`4
9 5 8 1`,
      output:`1 5 8 9`
    }
  ],

  runTestCases:[
    {
      input:`3
100 50 75`,
      output:`50 75 100`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
10 20 30 40 50`,
      output:`10 20 30 40 50`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Collections.sort","ArrayList"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. TreeSet - Store Unique Elements
// =======================

{
  id:7,
  language:"java",
  concept:"collections",
  difficulty:"medium",
  xp:100,

  title:"TreeSet Unique Elements",

  statement:
  "Read N integers and store them in a TreeSet. Print the unique elements in sorted order.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Sorted unique elements.",

  sampleInput:`6
4 2 5 2 1 4`,

  sampleOutput:`1 2 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "TreeSet automatically removes duplicates and maintains sorted order.",

  examples:[
    {
      input:`5
7 7 3 2 1`,
      output:`1 2 3 7`
    }
  ],

  runTestCases:[
    {
      input:`4
9 8 7 6`,
      output:`6 7 8 9`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
5 5 5`,
      output:`5`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["TreeSet"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. TreeMap Student Marks
// =======================

{
  id:8,
  language:"java",
  concept:"collections",
  difficulty:"hard",
  xp:110,

  title:"Student Marks using TreeMap",

  statement:
  "Read student names and marks. Store them in a TreeMap and print the entries sorted by student name.",

  inputFormat:
  "First line contains N.\nNext N lines contain name and marks.",

  outputFormat:
  "Student Name Marks",

  sampleInput:`3
John 85
Alice 90
David 75`,

  sampleOutput:`Alice 90
David 75
John 85`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "TreeMap stores key-value pairs in sorted order of keys.",

  examples:[
    {
      input:`2
Tom 70
Jerry 95`,
      output:`Jerry 95
Tom 70`
    }
  ],

  runTestCases:[
    {
      input:`2
Emma 88
Alex 99`,
      output:`Alex 99
Emma 88`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
Sophia 100`,
      output:`Sophia 100`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["TreeMap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Priority Queue
// =======================

{
  id:9,
  language:"java",
  concept:"collections",
  difficulty:"hard",
  xp:120,

  title:"Priority Queue",

  statement:
  "Read N integers and insert them into a PriorityQueue. Remove and print the elements in priority order.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Elements in ascending order.",

  sampleInput:`5
40 10 20 30 50`,

  sampleOutput:`10 20 30 40 50`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "PriorityQueue removes elements according to their priority (minimum first by default).",

  examples:[
    {
      input:`4
9 1 6 3`,
      output:`1 3 6 9`
    }
  ],

  runTestCases:[
    {
      input:`3
100 50 75`,
      output:`50 75 100`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 4 3 2 1`,
      output:`1 2 3 4 5`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["PriorityQueue"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Library Management using Collections
// =======================

{
  id:10,
  language:"java",
  concept:"collections",
  difficulty:"hard",
  xp:140,

  title:"Library Management using Collections",

  statement:
  "Create a Book class. Store Book objects in an ArrayList, sort them alphabetically by title, and print the sorted list.",

  inputFormat:
  "First line contains N.\nNext N lines contain book titles.",

  outputFormat:
  "Sorted book titles.",

  sampleInput:`3
Java
Python
C++`,

  sampleOutput:`C++
Java
Python`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Store custom objects in an ArrayList and sort them using Collections.sort() or a Comparator.",

  examples:[
    {
      input:`2
OS
DBMS`,
      output:`DBMS
OS`
    }
  ],

  runTestCases:[
    {
      input:`3
AI
ML
Cloud`,
      output:`AI
Cloud
ML`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
Networking
Algorithms`,
      output:`Algorithms
Networking`
    }
  ],

  starterCode:`import java.util.*;

class Book{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Collections","Comparator","ArrayList"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}

],
 exceptionHandling:[
  // =======================
// 1. Handle ArithmeticException
// =======================

{
  id:1,
  language:"java",
  concept:"exception-handling",
  difficulty:"easy",
  xp:20,

  title:"Handle ArithmeticException",

  statement:
  "Read two integers and divide them. If the denominator is zero, catch the ArithmeticException and print 'Cannot Divide by Zero'.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Quotient or exception message.",

  sampleInput:`10
2`,

  sampleOutput:`5`,

  constraints:
  "-100000 ≤ Numbers ≤ 100000",

  explanation:
  "Use try-catch to handle ArithmeticException.",

  examples:[
    {
      input:`20
0`,
      output:`Cannot Divide by Zero`
    }
  ],

  runTestCases:[
    {
      input:`15
3`,
      output:`5`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
0`,
      output:`Cannot Divide by Zero`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["try-catch","ArithmeticException"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Handle ArrayIndexOutOfBoundsException
// =======================

{
  id:2,
  language:"java",
  concept:"exception-handling",
  difficulty:"easy",
  xp:35,

  title:"Handle Array Index Exception",

  statement:
  "Read an array and an index. Print the element at the given index. If the index is invalid, catch the exception.",

  inputFormat:
  "N\nArray Elements\nIndex",

  outputFormat:
  "Element or Invalid Index.",

  sampleInput:`5
10 20 30 40 50
2`,

  sampleOutput:`30`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Catch ArrayIndexOutOfBoundsException.",

  examples:[
    {
      input:`3
5 6 7
5`,
      output:`Invalid Index`
    }
  ],

  runTestCases:[
    {
      input:`4
1 2 3 4
1`,
      output:`2`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
10 20
10`,
      output:`Invalid Index`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["ArrayIndexOutOfBoundsException"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Handle NumberFormatException
// =======================

{
  id:3,
  language:"java",
  concept:"exception-handling",
  difficulty:"medium",
  xp:50,

  title:"Handle Number Format Exception",

  statement:
  "Read a string and convert it into an integer. If conversion fails, catch NumberFormatException.",

  inputFormat:
  "One string.",

  outputFormat:
  "Integer or Invalid Number.",

  sampleInput:`123`,

  sampleOutput:`123`,

  constraints:
  "Input length ≤ 100",

  explanation:
  "Use Integer.parseInt() inside try-catch.",

  examples:[
    {
      input:`abc`,
      output:`Invalid Number`
    }
  ],

  runTestCases:[
    {
      input:`1000`,
      output:`1000`
    }
  ],

  hiddenTestCases:[
    {
      input:`OpenAI`,
      output:`Invalid Number`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["NumberFormatException"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Finally Block
// =======================

{
  id:4,
  language:"java",
  concept:"exception-handling",
  difficulty:"medium",
  xp:65,

  title:"Finally Block Execution",

  statement:
  "Read two integers and divide them. Whether an exception occurs or not, print 'Program Completed' using finally.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Result followed by Program Completed.",

  sampleInput:`20
4`,

  sampleOutput:`5
Program Completed`,

  constraints:
  "Valid integers.",

  explanation:
  "The finally block executes regardless of exceptions.",

  examples:[
    {
      input:`10
0`,
      output:`Cannot Divide by Zero
Program Completed`
    }
  ],

  runTestCases:[
    {
      input:`50
10`,
      output:`5
Program Completed`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
0`,
      output:`Cannot Divide by Zero
Program Completed`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["finally"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Multiple Catch Blocks
// =======================

{
  id:5,
  language:"java",
  concept:"exception-handling",
  difficulty:"medium",
  xp:80,

  title:"Multiple Catch Blocks",

  statement:
  "Write a program that handles both ArithmeticException and ArrayIndexOutOfBoundsException using multiple catch blocks.",

  inputFormat:
  "Choice\nRequired Inputs",

  outputFormat:
  "Result or Exception Message.",

  sampleInput:`1
10
0`,

  sampleOutput:`Cannot Divide by Zero`,

  constraints:
  "Choice is valid.",

  explanation:
  "Handle different exception types using separate catch blocks.",

  examples:[
    {
      input:`2
3
1 2 3
5`,
      output:`Invalid Index`
    }
  ],

  runTestCases:[
    {
      input:`1
20
4`,
      output:`5`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
2
5 6
4`,
      output:`Invalid Index`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Multiple Catch"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Throw Keyword
// =======================

{
  id:6,
  language:"java",
  concept:"exception-handling",
  difficulty:"medium",
  xp:90,

  title:"Using throw Keyword",

  statement:
  "Read an integer age. If age is less than 18, throw an ArithmeticException with the message 'Not Eligible'. Otherwise print 'Eligible'.",

  inputFormat:
  "A single integer.",

  outputFormat:
  "Eligible or Exception Message.",

  sampleInput:`16`,

  sampleOutput:`Not Eligible`,

  constraints:
  "1 ≤ Age ≤ 100",

  explanation:
  "Use the throw keyword to explicitly throw an exception.",

  examples:[
    {
      input:`20`,
      output:`Eligible`
    }
  ],

  runTestCases:[
    {
      input:`17`,
      output:`Not Eligible`
    }
  ],

  hiddenTestCases:[
    {
      input:`18`,
      output:`Eligible`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc = new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["throw"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Throws Keyword
// =======================

{
  id:7,
  language:"java",
  concept:"exception-handling",
  difficulty:"medium",
  xp:100,

  title:"Using throws Keyword",

  statement:
  "Create a method divide(int a, int b) that declares throws ArithmeticException. Print the result or handle the exception in main().",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Quotient or Cannot Divide by Zero.",

  sampleInput:`20
4`,

  sampleOutput:`5`,

  constraints:
  "-100000 ≤ Values ≤ 100000",

  explanation:
  "Use the throws keyword while declaring the method.",

  examples:[
    {
      input:`10
0`,
      output:`Cannot Divide by Zero`
    }
  ],

  runTestCases:[
    {
      input:`30
5`,
      output:`6`
    }
  ],

  hiddenTestCases:[
    {
      input:`50
0`,
      output:`Cannot Divide by Zero`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    static int divide(int a,int b) throws ArithmeticException{

    }

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["throws"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Custom Exception
// =======================

{
  id:8,
  language:"java",
  concept:"exception-handling",
  difficulty:"hard",
  xp:110,

  title:"Custom Exception",

  statement:
  "Create a custom exception InvalidAgeException. If age is below 18, throw the custom exception; otherwise print 'Eligible'.",

  inputFormat:
  "Age",

  outputFormat:
  "Eligible or Invalid Age.",

  sampleInput:`15`,

  sampleOutput:`Invalid Age`,

  constraints:
  "1 ≤ Age ≤ 100",

  explanation:
  "User-defined exceptions are created by extending Exception.",

  examples:[
    {
      input:`25`,
      output:`Eligible`
    }
  ],

  runTestCases:[
    {
      input:`17`,
      output:`Invalid Age`
    }
  ],

  hiddenTestCases:[
    {
      input:`18`,
      output:`Eligible`
    }
  ],

  starterCode:`import java.util.*;

class InvalidAgeException extends Exception{

}

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Custom Exception"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Nested Try-Catch
// =======================

{
  id:9,
  language:"java",
  concept:"exception-handling",
  difficulty:"hard",
  xp:120,

  title:"Nested Try-Catch",

  statement:
  "Write a program using nested try-catch blocks. Handle ArithmeticException in the inner block and ArrayIndexOutOfBoundsException in the outer block.",

  inputFormat:
  "Choice and Required Inputs",

  outputFormat:
  "Result or Exception Message.",

  sampleInput:`1
10
0`,

  sampleOutput:`Cannot Divide by Zero`,

  constraints:
  "Choice is valid.",

  explanation:
  "Nested try-catch blocks help handle exceptions at different levels.",

  examples:[
    {
      input:`2
3
1 2 3
5`,
      output:`Invalid Index`
    }
  ],

  runTestCases:[
    {
      input:`1
20
4`,
      output:`5`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
2
10 20
5`,
      output:`Invalid Index`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Nested Try Catch"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Banking System Exception Handling
// =======================

{
  id:10,
  language:"java",
  concept:"exception-handling",
  difficulty:"hard",
  xp:140,

  title:"Banking System Exception Handling",

  statement:
  "Read account balance and withdrawal amount. If the withdrawal amount exceeds the balance, throw an exception with the message 'Insufficient Balance'. Otherwise print the remaining balance.",

  inputFormat:
  "Balance\nWithdrawal Amount",

  outputFormat:
  "Remaining Balance or Exception Message.",

  sampleInput:`5000
6000`,

  sampleOutput:`Insufficient Balance`,

  constraints:
  "Balance ≥ 0",

  explanation:
  "Use exceptions to validate business rules in a banking application.",

  examples:[
    {
      input:`7000
3000`,
      output:`4000`
    }
  ],

  runTestCases:[
    {
      input:`1000
1000`,
      output:`0`
    }
  ],

  hiddenTestCases:[
    {
      input:`2500
3000`,
      output:`Insufficient Balance`
    }
  ],

  starterCode:`import java.util.*;

public class Main{

    public static void main(String[] args){

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["Exception Handling","Banking"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],
fileHandling:[
  // =======================
// 1. Create a File
// =======================

{
  id:1,
  language:"java",
  concept:"file-handling",
  difficulty:"easy",
  xp:20,

  title:"Create a File",

  statement:
  "Write a program to create a file named student.txt. Print 'File Created' if successful, otherwise print 'File Already Exists'.",

  inputFormat:
  "No input.",

  outputFormat:
  "File Created or File Already Exists.",

  sampleInput:` `,

  sampleOutput:`File Created`,

  constraints:
  "None",

  explanation:
  "Use the File class and createNewFile() method.",

  examples:[
    {
      input:` `,
      output:`File Already Exists`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`File Created`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`File Already Exists`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["File","createNewFile"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Write to a File
// =======================

{
  id:2,
  language:"java",
  concept:"file-handling",
  difficulty:"easy",
  xp:35,

  title:"Write to a File",

  statement:
  "Read a string and write it into student.txt using FileWriter.",

  inputFormat:
  "A single line string.",

  outputFormat:
  "Data Written Successfully.",

  sampleInput:`Hello Java`,

  sampleOutput:`Data Written Successfully`,

  constraints:
  "Length ≤ 1000",

  explanation:
  "Use FileWriter to write text into a file.",

  examples:[
    {
      input:`SkillQuest`,
      output:`Data Written Successfully`
    }
  ],

  runTestCases:[
    {
      input:`OpenAI`,
      output:`Data Written Successfully`
    }
  ],

  hiddenTestCases:[
    {
      input:`Programming`,
      output:`Data Written Successfully`
    }
  ],

  starterCode:`import java.io.*;
import java.util.*;

public class Main{

    public static void main(String[] args) throws Exception{

        Scanner sc=new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["FileWriter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Read from a File
// =======================

{
  id:3,
  language:"java",
  concept:"file-handling",
  difficulty:"medium",
  xp:50,

  title:"Read from a File",

  statement:
  "Read the contents of student.txt using FileReader and print them.",

  inputFormat:
  "No input.",

  outputFormat:
  "Contents of the file.",

  sampleInput:` `,

  sampleOutput:`Hello Java`,

  constraints:
  "File exists.",

  explanation:
  "Use FileReader to read characters from a file.",

  examples:[
    {
      input:` `,
      output:`SkillQuest`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`OpenAI`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`Programming`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["FileReader"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Count Characters in a File
// =======================

{
  id:4,
  language:"java",
  concept:"file-handling",
  difficulty:"medium",
  xp:65,

  title:"Count Characters in File",

  statement:
  "Read a file and count the total number of characters present.",

  inputFormat:
  "No input.",

  outputFormat:
  "Character Count.",

  sampleInput:` `,

  sampleOutput:`10`,

  constraints:
  "File exists.",

  explanation:
  "Read each character until EOF and count them.",

  examples:[
    {
      input:` `,
      output:`15`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`8`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`25`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["FileReader"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Copy File Content
// =======================

{
  id:5,
  language:"java",
  concept:"file-handling",
  difficulty:"medium",
  xp:80,

  title:"Copy File Content",

  statement:
  "Copy the contents of source.txt into destination.txt using FileReader and FileWriter.",

  inputFormat:
  "No input.",

  outputFormat:
  "File Copied Successfully.",

  sampleInput:` `,

  sampleOutput:`File Copied Successfully`,

  constraints:
  "Source file exists.",

  explanation:
  "Read one file and write its contents into another file.",

  examples:[
    {
      input:` `,
      output:`File Copied Successfully`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`File Copied Successfully`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`File Copied Successfully`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["FileReader","FileWriter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Append Data to a File
// =======================

{
  id:6,
  language:"java",
  concept:"file-handling",
  difficulty:"medium",
  xp:90,

  title:"Append Data to a File",

  statement:
  "Read a string and append it to student.txt without removing the existing content.",

  inputFormat:
  "A single line string.",

  outputFormat:
  "Data Appended Successfully.",

  sampleInput:`Welcome`,

  sampleOutput:`Data Appended Successfully`,

  constraints:
  "Input length ≤ 1000",

  explanation:
  "Use FileWriter in append mode by passing true as the second parameter.",

  examples:[
    {
      input:`OpenAI`,
      output:`Data Appended Successfully`
    }
  ],

  runTestCases:[
    {
      input:`Java`,
      output:`Data Appended Successfully`
    }
  ],

  hiddenTestCases:[
    {
      input:`Programming`,
      output:`Data Appended Successfully`
    }
  ],

  starterCode:`import java.io.*;
import java.util.*;

public class Main{

    public static void main(String[] args) throws Exception{

        Scanner sc = new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["FileWriter","Append"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Count Number of Lines
// =======================

{
  id:7,
  language:"java",
  concept:"file-handling",
  difficulty:"medium",
  xp:100,

  title:"Count Number of Lines",

  statement:
  "Read student.txt using BufferedReader and count the total number of lines.",

  inputFormat:
  "No input.",

  outputFormat:
  "Total number of lines.",

  sampleInput:` `,

  sampleOutput:`5`,

  constraints:
  "File exists.",

  explanation:
  "BufferedReader reads the file line by line.",

  examples:[
    {
      input:` `,
      output:`3`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`8`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`10`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["BufferedReader"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Count Number of Words
// =======================

{
  id:8,
  language:"java",
  concept:"file-handling",
  difficulty:"hard",
  xp:110,

  title:"Count Number of Words",

  statement:
  "Read the contents of student.txt and print the total number of words.",

  inputFormat:
  "No input.",

  outputFormat:
  "Word Count.",

  sampleInput:` `,

  sampleOutput:`12`,

  constraints:
  "File exists.",

  explanation:
  "Split each line into words and count them.",

  examples:[
    {
      input:` `,
      output:`20`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`15`
    }
  ],

  hiddenTestCases:[
    {
      input:` `,
      output:`25`
    }
  ],

  starterCode:`import java.io.*;

public class Main{

    public static void main(String[] args) throws Exception{

        // Write your code

    }

}`,

  tags:["BufferedReader","Words"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. BufferedWriter Example
// =======================

{
  id:9,
  language:"java",
  concept:"file-handling",
  difficulty:"hard",
  xp:120,

  title:"Write using BufferedWriter",

  statement:
  "Read multiple lines from the user and write them into student.txt using BufferedWriter.",

  inputFormat:
  "First line contains N.\nNext N lines contain text.",

  outputFormat:
  "Data Written Successfully.",

  sampleInput:`3
Java
Python
C++`,

  sampleOutput:`Data Written Successfully`,

  constraints:
  "1 ≤ N ≤ 100",

  explanation:
  "BufferedWriter improves writing performance by buffering data.",

  examples:[
    {
      input:`2
Hello
World`,
      output:`Data Written Successfully`
    }
  ],

  runTestCases:[
    {
      input:`1
SkillQuest`,
      output:`Data Written Successfully`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
OpenAI
ChatGPT`,
      output:`Data Written Successfully`
    }
  ],

  starterCode:`import java.io.*;
import java.util.*;

public class Main{

    public static void main(String[] args) throws Exception{

        Scanner sc = new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["BufferedWriter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Student Record Management
// =======================

{
  id:10,
  language:"java",
  concept:"file-handling",
  difficulty:"hard",
  xp:140,

  title:"Student Record Management",

  statement:
  "Read N student records (ID, Name, Marks), store them in student.txt, then read the file and display all records.",

  inputFormat:
  "First line contains N.\nNext N lines contain ID, Name and Marks.",

  outputFormat:
  "Display all student records.",

  sampleInput:`2
101 John 85
102 Alice 90`,

  sampleOutput:`101 John 85
102 Alice 90`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Combine FileWriter/FileReader (or BufferedWriter/BufferedReader) to implement a simple student record system.",

  examples:[
    {
      input:`1
201 David 95`,
      output:`201 David 95`
    }
  ],

  runTestCases:[
    {
      input:`2
301 Emma 99
302 Alex 87`,
      output:`301 Emma 99
302 Alex 87`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
401 Sophia 100`,
      output:`401 Sophia 100`
    }
  ],

  starterCode:`import java.io.*;
import java.util.*;

public class Main{

    public static void main(String[] args) throws Exception{

        Scanner sc = new Scanner(System.in);

        // Write your code

    }

}`,

  tags:["File Handling","BufferedReader","BufferedWriter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],
functions:[
  // =======================
// 1. Sum of Two Numbers using Function
// =======================

{
  id:1,
  language:"python",
  concept:"functions",
  difficulty:"easy",
  xp:20,

  title:"Sum of Two Numbers using Function",

  statement:
  "Write a function add(a, b) that returns the sum of two numbers.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Print the sum.",

  sampleInput:`10
20`,

  sampleOutput:`30`,

  constraints:
  "-10^5 ≤ A,B ≤ 10^5",

  explanation:
  "Create a function named add() that returns the sum of two integers.",

  examples:[
    {
      input:`5
7`,
      output:`12`
    }
  ],

  runTestCases:[
    {
      input:`15
30`,
      output:`45`
    }
  ],

  hiddenTestCases:[
    {
      input:`-5
5`,
      output:`0`
    }
  ],

  starterCode:`def add(a, b):
    # Write your code here
    pass

a = int(input())
b = int(input())

print(add(a, b))`,

  tags:["Functions"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Maximum of Three Numbers
// =======================

{
  id:2,
  language:"python",
  concept:"functions",
  difficulty:"easy",
  xp:30,

  title:"Maximum of Three Numbers",

  statement:
  "Write a function maximum(a, b, c) that returns the largest among three integers.",

  inputFormat:
  "Three integers.",

  outputFormat:
  "Largest number.",

  sampleInput:`10
50
20`,

  sampleOutput:`50`,

  constraints:
  "-10^5 ≤ Numbers ≤ 10^5",

  explanation:
  "Return the maximum value among the three numbers.",

  examples:[
    {
      input:`2
8
6`,
      output:`8`
    }
  ],

  runTestCases:[
    {
      input:`100
25
60`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`-5
-2
-9`,
      output:`-2`
    }
  ],

  starterCode:`def maximum(a, b, c):
    # Write your code here
    pass

a = int(input())
b = int(input())
c = int(input())

print(maximum(a, b, c))`,

  tags:["Functions"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Prime Number using Function
// =======================

{
  id:3,
  language:"python",
  concept:"functions",
  difficulty:"medium",
  xp:45,

  title:"Prime Number using Function",

  statement:
  "Write a function isPrime(n) that returns True if the number is prime; otherwise return False.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Print Prime or Not Prime.",

  sampleInput:`17`,

  sampleOutput:`Prime`,

  constraints:
  "2 ≤ N ≤ 10^5",

  explanation:
  "Check divisibility from 2 to √N.",

  examples:[
    {
      input:`20`,
      output:`Not Prime`
    }
  ],

  runTestCases:[
    {
      input:`29`,
      output:`Prime`
    }
  ],

  hiddenTestCases:[
    {
      input:`97`,
      output:`Prime`
    }
  ],

  starterCode:`def isPrime(n):
    # Write your code here
    pass

n = int(input())

if isPrime(n):
    print("Prime")
else:
    print("Not Prime")`,

  tags:["Functions","Prime"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Factorial using Function
// =======================

{
  id:4,
  language:"python",
  concept:"functions",
  difficulty:"medium",
  xp:60,

  title:"Factorial using Function",

  statement:
  "Write a function factorial(n) that returns the factorial of a given integer.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Factorial.",

  sampleInput:`5`,

  sampleOutput:`120`,

  constraints:
  "0 ≤ N ≤ 20",

  explanation:
  "Compute the factorial using a separate function.",

  examples:[
    {
      input:`4`,
      output:`24`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`10`,
      output:`3628800`
    }
  ],

  starterCode:`def factorial(n):
    # Write your code here
    pass

n = int(input())

print(factorial(n))`,

  tags:["Functions","Loops"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Fibonacci using Function
// =======================

{
  id:5,
  language:"python",
  concept:"functions",
  difficulty:"medium",
  xp:75,

  title:"Fibonacci using Function",

  statement:
  "Write a function fibonacci(n) that returns the nth Fibonacci number.",

  inputFormat:
  "One integer.",

  outputFormat:
  "Nth Fibonacci number.",

  sampleInput:`7`,

  sampleOutput:`13`,

  constraints:
  "0 ≤ N ≤ 30",

  explanation:
  "Generate the Fibonacci sequence using a function.",

  examples:[
    {
      input:`5`,
      output:`5`
    }
  ],

  runTestCases:[
    {
      input:`10`,
      output:`55`
    }
  ],

  hiddenTestCases:[
    {
      input:`15`,
      output:`610`
    }
  ],

  starterCode:`def fibonacci(n):
    # Write your code here
    pass

n = int(input())

print(fibonacci(n))`,

  tags:["Functions","Fibonacci"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Recursive Sum of Digits
// =======================

{
  id:6,
  language:"python",
  concept:"functions",
  difficulty:"medium",
  xp:90,

  title:"Recursive Sum of Digits",

  statement:
  "Write a recursive function sumDigits(n) that returns the sum of all digits in a number.",

  inputFormat:
  "A single integer.",

  outputFormat:
  "Sum of digits.",

  sampleInput:`1234`,

  sampleOutput:`10`,

  constraints:
  "0 ≤ N ≤ 10^18",

  explanation:
  "Solve the problem using recursion without converting the number to a string.",

  examples:[
    {
      input:`999`,
      output:`27`
    }
  ],

  runTestCases:[
    {
      input:`1005`,
      output:`6`
    }
  ],

  hiddenTestCases:[
    {
      input:`987654`,
      output:`39`
    }
  ],

  starterCode:`def sumDigits(n):
    # Write your code here
    pass

n = int(input())

print(sumDigits(n))`,

  tags:["Functions","Recursion"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Count Vowels using Function
// =======================

{
  id:7,
  language:"python",
  concept:"functions",
  difficulty:"medium",
  xp:100,

  title:"Count Vowels using Function",

  statement:
  "Write a function countVowels(s) that returns the number of vowels in a string.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Number of vowels.",

  sampleInput:`Programming`,

  sampleOutput:`3`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Traverse the string and count vowels (a, e, i, o, u).",

  examples:[
    {
      input:`Education`,
      output:`5`
    }
  ],

  runTestCases:[
    {
      input:`SkillQuest`,
      output:`3`
    }
  ],

  hiddenTestCases:[
    {
      input:`OpenAI`,
      output:`4`
    }
  ],

  starterCode:`def countVowels(s):
    # Write your code here
    pass

s = input()

print(countVowels(s))`,

  tags:["Functions","Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Palindrome using Function
// =======================

{
  id:8,
  language:"python",
  concept:"functions",
  difficulty:"hard",
  xp:110,

  title:"Palindrome using Function",

  statement:
  "Write a function isPalindrome(s) that returns True if the string is a palindrome; otherwise return False.",

  inputFormat:
  "A single string.",

  outputFormat:
  "Palindrome or Not Palindrome.",

  sampleInput:`madam`,

  sampleOutput:`Palindrome`,

  constraints:
  "1 ≤ Length ≤ 1000",

  explanation:
  "Compare the string with its reverse.",

  examples:[
    {
      input:`python`,
      output:`Not Palindrome`
    }
  ],

  runTestCases:[
    {
      input:`level`,
      output:`Palindrome`
    }
  ],

  hiddenTestCases:[
    {
      input:`racecar`,
      output:`Palindrome`
    }
  ],

  starterCode:`def isPalindrome(s):
    # Write your code here
    pass

s = input()

if isPalindrome(s):
    print("Palindrome")
else:
    print("Not Palindrome")`,

  tags:["Functions","Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. GCD using Function
// =======================

{
  id:9,
  language:"python",
  concept:"functions",
  difficulty:"hard",
  xp:120,

  title:"Greatest Common Divisor (GCD)",

  statement:
  "Write a function gcd(a, b) using the Euclidean Algorithm and return the greatest common divisor of two integers.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Greatest Common Divisor.",

  sampleInput:`24
36`,

  sampleOutput:`12`,

  constraints:
  "1 ≤ A,B ≤ 10^9",

  explanation:
  "Repeatedly replace (a, b) with (b, a % b) until b becomes 0.",

  examples:[
    {
      input:`18
30`,
      output:`6`
    }
  ],

  runTestCases:[
    {
      input:`81
27`,
      output:`27`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
25`,
      output:`25`
    }
  ],

  starterCode:`def gcd(a, b):
    # Write your code here
    pass

a = int(input())
b = int(input())

print(gcd(a, b))`,

  tags:["Functions","Math"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Recursive Binary Search
// =======================

{
  id:10,
  language:"python",
  concept:"functions",
  difficulty:"hard",
  xp:140,

  title:"Recursive Binary Search",

  statement:
  "Write a recursive function binarySearch(arr, left, right, target) that returns the index of the target element in a sorted list. Return -1 if not found.",

  inputFormat:
  "First line contains N.\nSecond line contains N sorted integers.\nThird line contains target.",

  outputFormat:
  "Index of target or -1.",

  sampleInput:`5
2 4 6 8 10
8`,

  sampleOutput:`3`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use recursion to repeatedly divide the search space in half.",

  examples:[
    {
      input:`6
1 3 5 7 9 11
4`,
      output:`-1`
    }
  ],

  runTestCases:[
    {
      input:`5
10 20 30 40 50
20`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`7
5 10 15 20 25 30 35
35`,
      output:`6`
    }
  ],

  starterCode:`def binarySearch(arr, left, right, target):
    # Write your code here
    pass

n = int(input())
arr = list(map(int, input().split()))
target = int(input())

print(binarySearch(arr, 0, n - 1, target))`,

  tags:["Functions","Recursion","Binary Search"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],
lists:[
  // =======================
// 1. Find Maximum Element
// =======================

{
  id:1,
  language:"python",
  concept:"lists",
  difficulty:"easy",
  xp:20,

  title:"Find Maximum Element",

  statement:
  "Given a list of integers, find and print the maximum element.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Maximum element.",

  sampleInput:`5
10 25 6 48 12`,

  sampleOutput:`48`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the list or use Python's built-in max() function.",

  examples:[
    {
      input:`4
3 8 1 5`,
      output:`8`
    }
  ],

  runTestCases:[
    {
      input:`3
100 20 50`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
-5 -2 -9 -1 -6`,
      output:`-1`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Reverse a List
// =======================

{
  id:2,
  language:"python",
  concept:"lists",
  difficulty:"easy",
  xp:30,

  title:"Reverse a List",

  statement:
  "Given a list of integers, print the elements in reverse order.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Reversed List",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`5 4 3 2 1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use slicing or reverse().",

  examples:[
    {
      input:`4
8 6 4 2`,
      output:`2 4 6 8`
    }
  ],

  runTestCases:[
    {
      input:`3
9 8 7`,
      output:`7 8 9`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
10`,
      output:`10`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Remove Duplicates
// =======================

{
  id:3,
  language:"python",
  concept:"lists",
  difficulty:"medium",
  xp:45,

  title:"Remove Duplicate Elements",

  statement:
  "Given a list of integers, remove duplicate elements while maintaining the original order.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Unique Elements",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`1 2 3 4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Preserve insertion order while removing duplicates.",

  examples:[
    {
      input:`5
5 5 6 7 7`,
      output:`5 6 7`
    }
  ],

  runTestCases:[
    {
      input:`4
2 3 2 4`,
      output:`2 3 4`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`9`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Second Largest Element
// =======================

{
  id:4,
  language:"python",
  concept:"lists",
  difficulty:"medium",
  xp:60,

  title:"Second Largest Element",

  statement:
  "Find the second largest distinct element in the list.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Second Largest Element.",

  sampleInput:`5
10 50 40 50 20`,

  sampleOutput:`40`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Ignore duplicate values while finding the second largest element.",

  examples:[
    {
      input:`4
8 6 4 2`,
      output:`6`
    }
  ],

  runTestCases:[
    {
      input:`5
100 90 80 70 60`,
      output:`90`
    }
  ],

  hiddenTestCases:[
    {
      input:`6
2 2 3 4 4 5`,
      output:`4`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Rotate List Left
// =======================

{
  id:5,
  language:"python",
  concept:"lists",
  difficulty:"medium",
  xp:75,

  title:"Rotate List Left",

  statement:
  "Rotate the list to the left by K positions.",

  inputFormat:
  "N\nList Elements\nK",

  outputFormat:
  "Rotated List.",

  sampleInput:`5
1 2 3 4 5
2`,

  sampleOutput:`3 4 5 1 2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Move the first K elements to the end of the list.",

  examples:[
    {
      input:`4
10 20 30 40
1`,
      output:`20 30 40 10`
    }
  ],

  runTestCases:[
    {
      input:`6
1 2 3 4 5 6
3`,
      output:`4 5 6 1 2 3`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 4 3 2 1
4`,
      output:`1 5 4 3 2`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))
k=int(input())

# Write your code here`,

  tags:["Lists"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Merge Two Sorted Lists
// =======================

{
  id:6,
  language:"python",
  concept:"lists",
  difficulty:"medium",
  xp:90,

  title:"Merge Two Sorted Lists",

  statement:
  "Given two sorted lists, merge them into a single sorted list.",

  inputFormat:
  "N\nFirst Sorted List\nM\nSecond Sorted List",

  outputFormat:
  "Merged Sorted List.",

  sampleInput:`3
1 3 5
4
2 4 6 8`,

  sampleOutput:`1 2 3 4 5 6 8`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Merge both sorted lists while maintaining sorted order.",

  examples:[
    {
      input:`2
10 20
2
15 25`,
      output:`10 15 20 25`
    }
  ],

  runTestCases:[
    {
      input:`3
2 4 6
3
1 3 5`,
      output:`1 2 3 4 5 6`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
5
1
10`,
      output:`5 10`
    }
  ],

  starterCode:`n=int(input())
arr1=list(map(int,input().split()))

m=int(input())
arr2=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists","Merge"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Find Missing Number
// =======================

{
  id:7,
  language:"python",
  concept:"lists",
  difficulty:"medium",
  xp:100,

  title:"Find Missing Number",

  statement:
  "Given a list containing numbers from 1 to N with one number missing, find the missing number.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Missing Number.",

  sampleInput:`5
1 2 4 5`,

  sampleOutput:`3`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Use the sum formula or XOR to find the missing number.",

  examples:[
    {
      input:`4
2 3 4`,
      output:`1`
    }
  ],

  runTestCases:[
    {
      input:`6
1 2 3 5 6`,
      output:`4`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 3`,
      output:`2`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists","Math"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Move All Zeroes to End
// =======================

{
  id:8,
  language:"python",
  concept:"lists",
  difficulty:"hard",
  xp:110,

  title:"Move All Zeroes to End",

  statement:
  "Move all zeroes to the end of the list while maintaining the order of non-zero elements.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Modified List.",

  sampleInput:`6
0 1 0 3 12 0`,

  sampleOutput:`1 3 12 0 0 0`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Maintain the relative order of non-zero elements.",

  examples:[
    {
      input:`5
1 0 2 0 3`,
      output:`1 2 3 0 0`
    }
  ],

  runTestCases:[
    {
      input:`4
0 0 5 6`,
      output:`5 6 0 0`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
0 0 0`,
      output:`0 0 0`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists","Two Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Two Sum (LeetCode #1)
// =======================

{
  id:9,
  language:"python",
  concept:"lists",
  difficulty:"hard",
  xp:120,

  title:"Two Sum",

  statement:
  "Given a list of integers and a target value, return the indices of the two numbers whose sum equals the target.",

  inputFormat:
  "N\nList Elements\nTarget",

  outputFormat:
  "Indices.",

  sampleInput:`4
2 7 11 15
9`,

  sampleOutput:`0 1`,

  constraints:
  "Exactly one valid answer exists.",

  explanation:
  "Use a dictionary (hash map) for an O(N) solution.",

  examples:[
    {
      input:`3
3 2 4
6`,
      output:`1 2`
    }
  ],

  runTestCases:[
    {
      input:`2
3 3
6`,
      output:`0 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
1 2 3 4 5
9`,
      output:`3 4`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))
target=int(input())

# Write your code here`,

  tags:["Lists","HashMap","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Best Time to Buy and Sell Stock (LeetCode #121)
// =======================

{
  id:10,
  language:"python",
  concept:"lists",
  difficulty:"hard",
  xp:140,

  title:"Best Time to Buy and Sell Stock",

  statement:
  "Given a list where each element represents the stock price on a given day, find the maximum profit that can be achieved by buying once and selling once. If no profit is possible, print 0.",

  inputFormat:
  "N\nStock Prices",

  outputFormat:
  "Maximum Profit.",

  sampleInput:`6
7 1 5 3 6 4`,

  sampleOutput:`5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Track the minimum price seen so far and calculate the maximum profit.",

  examples:[
    {
      input:`5
7 6 4 3 1`,
      output:`0`
    }
  ],

  runTestCases:[
    {
      input:`6
2 4 1 7 5 9`,
      output:`8`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
3 8 2 10 1`,
      output:`8`
    }
  ],

  starterCode:`n=int(input())
prices=list(map(int,input().split()))

# Write your code here`,

  tags:["Lists","Greedy","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
}
],
tuples:[
  // =======================
// 1. Create and Print Tuple
// =======================

{
  id:1,
  language:"python",
  concept:"tuples",
  difficulty:"easy",
  xp:20,

  title:"Create and Print Tuple",

  statement:
  "Read N integers, store them in a tuple and print the tuple.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Print the tuple.",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`(10, 20, 30, 40, 50)`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Convert the input list into a tuple using tuple().",

  examples:[
    {
      input:`3
1 2 3`,
      output:`(1, 2, 3)`
    }
  ],

  runTestCases:[
    {
      input:`2
100 200`,
      output:`(100, 200)`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
5`,
      output:`(5,)`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Tuple"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Find Tuple Length
// =======================

{
  id:2,
  language:"python",
  concept:"tuples",
  difficulty:"easy",
  xp:30,

  title:"Find Tuple Length",

  statement:
  "Given a tuple, print the total number of elements present in it.",

  inputFormat:
  "N\nTuple Elements",

  outputFormat:
  "Length of tuple.",

  sampleInput:`4
5 10 15 20`,

  sampleOutput:`4`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use len() to determine the tuple size.",

  examples:[
    {
      input:`2
7 9`,
      output:`2`
    }
  ],

  runTestCases:[
    {
      input:`5
1 2 3 4 5`,
      output:`5`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
100`,
      output:`1`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Maximum Element in Tuple
// =======================

{
  id:3,
  language:"python",
  concept:"tuples",
  difficulty:"medium",
  xp:45,

  title:"Maximum Element in Tuple",

  statement:
  "Find and print the maximum element in the tuple.",

  inputFormat:
  "N\nTuple Elements",

  outputFormat:
  "Maximum element.",

  sampleInput:`5
8 15 2 30 10`,

  sampleOutput:`30`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use max() or traverse the tuple.",

  examples:[
    {
      input:`4
1 5 3 2`,
      output:`5`
    }
  ],

  runTestCases:[
    {
      input:`3
100 50 75`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
-5 -1`,
      output:`-1`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Count Occurrences
// =======================

{
  id:4,
  language:"python",
  concept:"tuples",
  difficulty:"medium",
  xp:60,

  title:"Count Occurrences",

  statement:
  "Given a tuple and an element X, print how many times X occurs in the tuple.",

  inputFormat:
  "N\nTuple Elements\nX",

  outputFormat:
  "Frequency of X.",

  sampleInput:`6
1 2 2 3 2 5
2`,

  sampleOutput:`3`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use the count() method of tuples.",

  examples:[
    {
      input:`4
5 6 7 5
5`,
      output:`2`
    }
  ],

  runTestCases:[
    {
      input:`3
1 2 3
2`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
9 9 9 9 9
9`,
      output:`5`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))
x=int(input())

# Write your code here`,

  tags:["Tuple","count"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Find Element Index
// =======================

{
  id:5,
  language:"python",
  concept:"tuples",
  difficulty:"medium",
  xp:75,

  title:"Find Element Index",

  statement:
  "Given a tuple and an element X, print the index of its first occurrence. If the element is not present, print -1.",

  inputFormat:
  "N\nTuple Elements\nX",

  outputFormat:
  "Index or -1.",

  sampleInput:`5
10 20 30 40 50
30`,

  sampleOutput:`2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use index() after checking whether the element exists.",

  examples:[
    {
      input:`4
2 4 6 8
5`,
      output:`-1`
    }
  ],

  runTestCases:[
    {
      input:`5
1 2 3 4 5
4`,
      output:`3`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
100 200 300
100`,
      output:`0`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))
x=int(input())

# Write your code here`,

  tags:["Tuple","index"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Merge Two Tuples
// =======================

{
  id:6,
  language:"python",
  concept:"tuples",
  difficulty:"medium",
  xp:90,

  title:"Merge Two Tuples",

  statement:
  "Read two tuples and merge them into a single tuple.",

  inputFormat:
  "N\nFirst Tuple\nM\nSecond Tuple",

  outputFormat:
  "Merged Tuple.",

  sampleInput:`3
1 2 3
2
4 5`,

  sampleOutput:`(1, 2, 3, 4, 5)`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use the '+' operator to concatenate two tuples.",

  examples:[
    {
      input:`2
10 20
3
30 40 50`,
      output:`(10, 20, 30, 40, 50)`
    }
  ],

  runTestCases:[
    {
      input:`1
5
1
10`,
      output:`(5, 10)`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
7 8
2
9 10`,
      output:`(7, 8, 9, 10)`
    }
  ],

  starterCode:`n=int(input())
t1=tuple(map(int,input().split()))

m=int(input())
t2=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple","Concatenation"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Sort a Tuple
// =======================

{
  id:7,
  language:"python",
  concept:"tuples",
  difficulty:"medium",
  xp:100,

  title:"Sort a Tuple",

  statement:
  "Read a tuple of integers and print the elements in sorted order as a tuple.",

  inputFormat:
  "N\nTuple Elements",

  outputFormat:
  "Sorted Tuple.",

  sampleInput:`5
4 1 5 2 3`,

  sampleOutput:`(1, 2, 3, 4, 5)`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Convert the tuple to a list, sort it, and convert it back to a tuple.",

  examples:[
    {
      input:`4
8 6 4 2`,
      output:`(2, 4, 6, 8)`
    }
  ],

  runTestCases:[
    {
      input:`3
9 7 8`,
      output:`(7, 8, 9)`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 50`,
      output:`(50, 100)`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple","Sorting"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Remove Duplicate Elements
// =======================

{
  id:8,
  language:"python",
  concept:"tuples",
  difficulty:"hard",
  xp:110,

  title:"Remove Duplicate Elements from Tuple",

  statement:
  "Given a tuple, remove duplicate elements while preserving their first occurrence and print the resulting tuple.",

  inputFormat:
  "N\nTuple Elements",

  outputFormat:
  "Tuple with unique elements.",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`(1, 2, 3, 4)`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Since tuples are immutable, create a new tuple with unique values.",

  examples:[
    {
      input:`5
5 5 6 6 7`,
      output:`(5, 6, 7)`
    }
  ],

  runTestCases:[
    {
      input:`4
2 3 2 4`,
      output:`(2, 3, 4)`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`(9,)`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple","Duplicates"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Tuple Packing and Unpacking
// =======================

{
  id:9,
  language:"python",
  concept:"tuples",
  difficulty:"hard",
  xp:120,

  title:"Tuple Packing and Unpacking",

  statement:
  "Read three integers, pack them into a tuple, unpack the tuple into three variables, and print the variables.",

  inputFormat:
  "Three integers.",

  outputFormat:
  "Three integers separated by spaces.",

  sampleInput:`10 20 30`,

  sampleOutput:`10 20 30`,

  constraints:
  "-10^9 ≤ Value ≤ 10^9",

  explanation:
  "Demonstrates tuple packing and unpacking in Python.",

  examples:[
    {
      input:`1 2 3`,
      output:`1 2 3`
    }
  ],

  runTestCases:[
    {
      input:`5 6 7`,
      output:`5 6 7`
    }
  ],

  hiddenTestCases:[
    {
      input:`100 200 300`,
      output:`100 200 300`
    }
  ],

  starterCode:`a,b,c=map(int,input().split())

# Write your code here`,

  tags:["Tuple","Packing","Unpacking"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Second Largest Element in Tuple
// =======================

{
  id:10,
  language:"python",
  concept:"tuples",
  difficulty:"hard",
  xp:140,

  title:"Second Largest Element in Tuple",

  statement:
  "Given a tuple of integers, print the second largest distinct element.",

  inputFormat:
  "N\nTuple Elements",

  outputFormat:
  "Second Largest Element.",

  sampleInput:`6
10 20 40 30 40 50`,

  sampleOutput:`40`,

  constraints:
  "2 ≤ N ≤ 100000",

  explanation:
  "Ignore duplicate values while finding the second largest element.",

  examples:[
    {
      input:`5
5 4 3 2 1`,
      output:`4`
    }
  ],

  runTestCases:[
    {
      input:`4
100 80 60 40`,
      output:`80`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
2 2 3 4 4`,
      output:`3`
    }
  ],

  starterCode:`n=int(input())
t=tuple(map(int,input().split()))

# Write your code here`,

  tags:["Tuple","Searching"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

dictionary:[
  // =======================
// 1. Create and Print Dictionary
// =======================

{
  id:1,
  language:"python",
  concept:"dictionary",
  difficulty:"easy",
  xp:20,

  title:"Create and Print Dictionary",

  statement:
  "Read N key-value pairs and store them in a dictionary. Print the dictionary.",

  inputFormat:
  "First line contains N.\nNext N lines contain key and value.",

  outputFormat:
  "Dictionary.",

  sampleInput:`3
A 10
B 20
C 30`,

  sampleOutput:`{'A': 10, 'B': 20, 'C': 30}`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use a Python dictionary to store key-value pairs.",

  examples:[
    {
      input:`2
X 5
Y 15`,
      output:`{'X': 5, 'Y': 15}`
    }
  ],

  runTestCases:[
    {
      input:`1
Age 25`,
      output:`{'Age': 25}`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
P 1
Q 2`,
      output:`{'P': 1, 'Q': 2}`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Search a Key
// =======================

{
  id:2,
  language:"python",
  concept:"dictionary",
  difficulty:"easy",
  xp:35,

  title:"Search a Key",

  statement:
  "Read a dictionary and a key. Print its value if the key exists; otherwise print 'Key Not Found'.",

  inputFormat:
  "N\nKey Value\n...\nSearch Key",

  outputFormat:
  "Value or Key Not Found.",

  sampleInput:`3
A 10
B 20
C 30
B`,

  sampleOutput:`20`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use the 'in' operator to check if a key exists.",

  examples:[
    {
      input:`2
X 5
Y 10
Z`,
      output:`Key Not Found`
    }
  ],

  runTestCases:[
    {
      input:`2
A 1
B 2
A`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
Age 18
Age`,
      output:`18`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","Search"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Frequency Count
// =======================

{
  id:3,
  language:"python",
  concept:"dictionary",
  difficulty:"medium",
  xp:50,

  title:"Frequency Count",

  statement:
  "Given a list of integers, count the frequency of every element using a dictionary.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Element Frequency",

  sampleInput:`5
1 2 2 3 3`,

  sampleOutput:`1 1
2 2
3 2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Store element-frequency pairs in a dictionary.",

  examples:[
    {
      input:`4
5 5 5 7`,
      output:`5 3
7 1`
    }
  ],

  runTestCases:[
    {
      input:`3
8 8 9`,
      output:`8 2
9 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
10 10 20 20 20`,
      output:`10 2
20 3`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Dictionary","Frequency"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Find Highest Value
// =======================

{
  id:4,
  language:"python",
  concept:"dictionary",
  difficulty:"medium",
  xp:65,

  title:"Find Highest Value",

  statement:
  "Read a dictionary of student names and marks. Print the student with the highest marks.",

  inputFormat:
  "N\nName Marks",

  outputFormat:
  "Student Name",

  sampleInput:`3
John 85
Alice 95
David 80`,

  sampleOutput:`Alice`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Traverse the dictionary and find the maximum value.",

  examples:[
    {
      input:`2
Tom 70
Jerry 90`,
      output:`Jerry`
    }
  ],

  runTestCases:[
    {
      input:`3
A 20
B 10
C 30`,
      output:`C`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
X 100
Y 99`,
      output:`X`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","Maximum"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Sort Dictionary by Key
// =======================

{
  id:5,
  language:"python",
  concept:"dictionary",
  difficulty:"medium",
  xp:80,

  title:"Sort Dictionary by Key",

  statement:
  "Read a dictionary and print all key-value pairs sorted by key.",

  inputFormat:
  "N\nKey Value",

  outputFormat:
  "Sorted Dictionary",

  sampleInput:`3
B 20
A 10
C 30`,

  sampleOutput:`A 10
B 20
C 30`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Use sorted(dictionary.keys()).",

  examples:[
    {
      input:`2
Y 5
X 2`,
      output:`X 2
Y 5`
    }
  ],

  runTestCases:[
    {
      input:`3
Cat 3
Apple 1
Ball 2`,
      output:`Apple 1
Ball 2
Cat 3`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
Z 100
A 50`,
      output:`A 50
Z 100`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","Sorting"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Merge Two Dictionaries
// =======================

{
  id:6,
  language:"python",
  concept:"dictionary",
  difficulty:"medium",
  xp:90,

  title:"Merge Two Dictionaries",

  statement:
  "Read two dictionaries and merge them into a single dictionary. If duplicate keys exist, keep the value from the second dictionary.",

  inputFormat:
  "N\nKey Value pairs\nM\nKey Value pairs",

  outputFormat:
  "Merged Dictionary.",

  sampleInput:`2
A 10
B 20
2
B 50
C 30`,

  sampleOutput:`{'A': 10, 'B': 50, 'C': 30}`,

  constraints:
  "1 ≤ N,M ≤ 1000",

  explanation:
  "Use update() or the | operator (Python 3.9+) to merge dictionaries.",

  examples:[
    {
      input:`1
X 5
1
Y 10`,
      output:`{'X': 5, 'Y': 10}`
    }
  ],

  runTestCases:[
    {
      input:`2
A 1
B 2
1
C 3`,
      output:`{'A': 1, 'B': 2, 'C': 3}`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
Age 20
1
Age 21`,
      output:`{'Age': 21}`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","Merge"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Invert a Dictionary
// =======================

{
  id:7,
  language:"python",
  concept:"dictionary",
  difficulty:"medium",
  xp:100,

  title:"Invert a Dictionary",

  statement:
  "Read a dictionary and swap its keys and values. Print the inverted dictionary.",

  inputFormat:
  "N\nKey Value",

  outputFormat:
  "Inverted Dictionary.",

  sampleInput:`3
A 10
B 20
C 30`,

  sampleOutput:`{10: 'A', 20: 'B', 30: 'C'}`,

  constraints:
  "Values are unique.",

  explanation:
  "Create a new dictionary where values become keys.",

  examples:[
    {
      input:`2
X 1
Y 2`,
      output:`{1: 'X', 2: 'Y'}`
    }
  ],

  runTestCases:[
    {
      input:`1
Age 25`,
      output:`{25: 'Age'}`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
P 100
Q 200`,
      output:`{100: 'P', 200: 'Q'}`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","Hashing"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Word Frequency Counter
// =======================

{
  id:8,
  language:"python",
  concept:"dictionary",
  difficulty:"hard",
  xp:110,

  title:"Word Frequency Counter",

  statement:
  "Given a sentence, count the frequency of every word using a dictionary.",

  inputFormat:
  "A single line sentence.",

  outputFormat:
  "Word Frequency.",

  sampleInput:`apple banana apple orange banana apple`,

  sampleOutput:`apple 3
banana 2
orange 1`,

  constraints:
  "Sentence length ≤ 10000",

  explanation:
  "Split the sentence into words and count their occurrences.",

  examples:[
    {
      input:`hello world hello`,
      output:`hello 2
world 1`
    }
  ],

  runTestCases:[
    {
      input:`python python java`,
      output:`python 2
java 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`a a a b`,
      output:`a 3
b 1`
    }
  ],

  starterCode:`sentence=input()

# Write your code here`,

  tags:["Dictionary","Strings"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Two Sum using Dictionary (LeetCode #1)
// =======================

{
  id:9,
  language:"python",
  concept:"dictionary",
  difficulty:"hard",
  xp:120,

  title:"Two Sum using Dictionary",

  statement:
  "Given a list of integers and a target value, return the indices of the two numbers whose sum equals the target.",

  inputFormat:
  "N\nList Elements\nTarget",

  outputFormat:
  "Indices.",

  sampleInput:`4
2 7 11 15
9`,

  sampleOutput:`0 1`,

  constraints:
  "Exactly one valid answer exists.",

  explanation:
  "Use a dictionary to store previously seen values for an O(N) solution.",

  examples:[
    {
      input:`3
3 2 4
6`,
      output:`1 2`
    }
  ],

  runTestCases:[
    {
      input:`2
3 3
6`,
      output:`0 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
1 2 3 4 5
9`,
      output:`3 4`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))
target=int(input())

# Write your code here`,

  tags:["Dictionary","HashMap","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Employee Management System
// =======================

{
  id:10,
  language:"python",
  concept:"dictionary",
  difficulty:"hard",
  xp:140,

  title:"Employee Management System",

  statement:
  "Store employee ID and salary in a dictionary. Perform search, update and delete operations based on user choice.",

  inputFormat:
  "Number of Employees\nEmployee ID Salary\nChoice\nRequired Input",

  outputFormat:
  "Updated Dictionary or Requested Result.",

  sampleInput:`3
101 50000
102 60000
103 70000
1
102`,

  sampleOutput:`60000`,

  constraints:
  "Employee IDs are unique.",

  explanation:
  "Use dictionary CRUD operations: insert, search, update and delete.",

  examples:[
    {
      input:`2
1 1000
2 2000
2
2 3000`,
      output:`{1: 1000, 2: 3000}`
    }
  ],

  runTestCases:[
    {
      input:`1
10 500
3
10`,
      output:`{}`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
1 100
2 200
1
1`,
      output:`100`
    }
  ],

  starterCode:`n=int(input())

# Write your code here`,

  tags:["Dictionary","CRUD","Real World"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],
sets:[
  // =======================
// 1. Create and Print Set
// =======================

{
  id:1,
  language:"python",
  concept:"sets",
  difficulty:"easy",
  xp:20,

  title:"Create and Print Set",

  statement:
  "Read N integers, store them in a set and print the unique elements.",

  inputFormat:
  "First line contains N.\nSecond line contains N integers.",

  outputFormat:
  "Unique elements.",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`{1, 2, 3, 4}`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Sets automatically remove duplicate elements.",

  examples:[
    {
      input:`5
5 5 6 7 7`,
      output:`{5, 6, 7}`
    }
  ],

  runTestCases:[
    {
      input:`4
10 20 20 30`,
      output:`{10, 20, 30}`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`{9}`
    }
  ],

  starterCode:`n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["Set"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Add and Remove Elements
// =======================

{
  id:2,
  language:"python",
  concept:"sets",
  difficulty:"easy",
  xp:35,

  title:"Add and Remove Elements",

  statement:
  "Read a set, add a new element, remove an existing element, and print the updated set.",

  inputFormat:
  "N\nSet Elements\nElement to Add\nElement to Remove",

  outputFormat:
  "Updated Set.",

  sampleInput:`4
1 2 3 4
5
2`,

  sampleOutput:`{1, 3, 4, 5}`,

  constraints:
  "Element to remove always exists.",

  explanation:
  "Use add() and remove() methods.",

  examples:[
    {
      input:`3
10 20 30
40
20`,
      output:`{10, 30, 40}`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
7
5`,
      output:`{6, 7}`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
100
200
100`,
      output:`{200}`
    }
  ],

  starterCode:`n=int(input())
s=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","add","remove"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Union of Two Sets
// =======================

{
  id:3,
  language:"python",
  concept:"sets",
  difficulty:"medium",
  xp:50,

  title:"Union of Two Sets",

  statement:
  "Read two sets and print their union.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "Union Set.",

  sampleInput:`3
1 2 3
3
3 4 5`,

  sampleOutput:`{1, 2, 3, 4, 5}`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use the union() method or | operator.",

  examples:[
    {
      input:`2
10 20
2
20 30`,
      output:`{10, 20, 30}`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
2
7 8`,
      output:`{5, 6, 7, 8}`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
1
1
1`,
      output:`{1}`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Union"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Intersection of Two Sets
// =======================

{
  id:4,
  language:"python",
  concept:"sets",
  difficulty:"medium",
  xp:65,

  title:"Intersection of Two Sets",

  statement:
  "Read two sets and print their common elements.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "Intersection Set.",

  sampleInput:`4
1 2 3 4
4
3 4 5 6`,

  sampleOutput:`{3, 4}`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use intersection() or & operator.",

  examples:[
    {
      input:`3
5 6 7
3
7 8 9`,
      output:`{7}`
    }
  ],

  runTestCases:[
    {
      input:`2
10 20
2
30 40`,
      output:`set()`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 2 3
3
1 2 3`,
      output:`{1, 2, 3}`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Intersection"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Difference of Two Sets
// =======================

{
  id:5,
  language:"python",
  concept:"sets",
  difficulty:"medium",
  xp:80,

  title:"Difference of Two Sets",

  statement:
  "Read two sets and print the elements present in the first set but not in the second.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "Difference Set.",

  sampleInput:`4
1 2 3 4
3
3 4 5`,

  sampleOutput:`{1, 2}`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use difference() or - operator.",

  examples:[
    {
      input:`3
10 20 30
2
20 40`,
      output:`{10, 30}`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
2
6 7`,
      output:`{5}`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 2 3
3
1 2 3`,
      output:`set()`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Difference"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Symmetric Difference
// =======================

{
  id:6,
  language:"python",
  concept:"sets",
  difficulty:"medium",
  xp:90,

  title:"Symmetric Difference",

  statement:
  "Read two sets and print the elements that are present in either of the sets but not in both.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "Symmetric Difference Set.",

  sampleInput:`4
1 2 3 4
4
3 4 5 6`,

  sampleOutput:`{1, 2, 5, 6}`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use symmetric_difference() or the ^ operator.",

  examples:[
    {
      input:`3
10 20 30
3
20 30 40`,
      output:`{10, 40}`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
2
6 7`,
      output:`{5, 7}`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 2 3
3
1 2 3`,
      output:`set()`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Symmetric Difference"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Check Subset
// =======================

{
  id:7,
  language:"python",
  concept:"sets",
  difficulty:"medium",
  xp:100,

  title:"Check Subset",

  statement:
  "Read two sets and determine whether the first set is a subset of the second set.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "True or False.",

  sampleInput:`2
1 2
4
1 2 3 4`,

  sampleOutput:`True`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use issubset() or <= operator.",

  examples:[
    {
      input:`2
5 6
2
5 7`,
      output:`False`
    }
  ],

  runTestCases:[
    {
      input:`1
10
2
10 20`,
      output:`True`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 2 3
3
1 2 3`,
      output:`True`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Subset"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Check Superset
// =======================

{
  id:8,
  language:"python",
  concept:"sets",
  difficulty:"hard",
  xp:110,

  title:"Check Superset",

  statement:
  "Read two sets and determine whether the first set is a superset of the second set.",

  inputFormat:
  "N\nFirst Set\nM\nSecond Set",

  outputFormat:
  "True or False.",

  sampleInput:`4
1 2 3 4
2
2 3`,

  sampleOutput:`True`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use issuperset() or >= operator.",

  examples:[
    {
      input:`2
5 6
3
5 6 7`,
      output:`False`
    }
  ],

  runTestCases:[
    {
      input:`3
10 20 30
2
20 30`,
      output:`True`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
1 2
2
1 2`,
      output:`True`
    }
  ],

  starterCode:`n=int(input())
s1=set(map(int,input().split()))

m=int(input())
s2=set(map(int,input().split()))

# Write your code here`,

  tags:["Set","Superset"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Common Elements from Multiple Lists
// =======================

{
  id:9,
  language:"python",
  concept:"sets",
  difficulty:"hard",
  xp:120,

  title:"Common Elements from Multiple Lists",

  statement:
  "Read three lists and print the elements that are common to all three lists.",

  inputFormat:
  "N\nList1\nM\nList2\nK\nList3",

  outputFormat:
  "Common Elements.",

  sampleInput:`4
1 2 3 4
4
2 3 5 6
3
2 3 7`,

  sampleOutput:`{2, 3}`,

  constraints:
  "1 ≤ N,M,K ≤ 100000",

  explanation:
  "Convert lists to sets and use the intersection operator.",

  examples:[
    {
      input:`3
10 20 30
3
20 30 40
3
30 40 50`,
      output:`{30}`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
2
6 7
2
6 8`,
      output:`{6}`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
1 2 3
3
4 5 6
3
7 8 9`,
      output:`set()`
    }
  ],

  starterCode:`n=int(input())
l1=list(map(int,input().split()))

m=int(input())
l2=list(map(int,input().split()))

k=int(input())
l3=list(map(int,input().split()))

# Write your code here`,

  tags:["Set","Intersection"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Longest Consecutive Sequence (LeetCode #128)
// =======================

{
  id:10,
  language:"python",
  concept:"sets",
  difficulty:"hard",
  xp:140,

  title:"Longest Consecutive Sequence",

  statement:
  "Given an unsorted list of integers, find the length of the longest consecutive sequence.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Length of the longest consecutive sequence.",

  sampleInput:`6
100 4 200 1 3 2`,

  sampleOutput:`4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use a set to achieve an O(N) solution by starting only from sequence beginnings.",

  examples:[
    {
      input:`5
0 3 7 2 5`,
      output:`2`
    }
  ],

  runTestCases:[
    {
      input:`7
1 2 3 4 10 11 12`,
      output:`4`
    }
  ],

  hiddenTestCases:[
    {
      input:`8
9 1 4 7 3 2 6 8`,
      output:`4`
    }
  ],

  starterCode:`n=int(input())
nums=list(map(int,input().split()))

# Write your code here`,

  tags:["Set","LeetCode","Hashing"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

modules:[
  // =======================
// 1. Import Math Module
// =======================

{
  id:1,
  language:"python",
  concept:"modules",
  difficulty:"easy",
  xp:20,

  title:"Import Math Module",

  statement:
  "Read an integer and print its square root using the math module.",

  inputFormat:
  "A single integer.",

  outputFormat:
  "Square root.",

  sampleInput:`25`,

  sampleOutput:`5.0`,

  constraints:
  "0 ≤ N ≤ 10^9",

  explanation:
  "Import the math module and use math.sqrt().",

  examples:[
    {
      input:`81`,
      output:`9.0`
    }
  ],

  runTestCases:[
    {
      input:`49`,
      output:`7.0`
    }
  ],

  hiddenTestCases:[
    {
      input:`100`,
      output:`10.0`
    }
  ],

  starterCode:`import math

n=int(input())

# Write your code here`,

  tags:["math"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Calculate Factorial
// =======================

{
  id:2,
  language:"python",
  concept:"modules",
  difficulty:"easy",
  xp:35,

  title:"Factorial using math Module",

  statement:
  "Read an integer and print its factorial using the math module.",

  inputFormat:"Integer",

  outputFormat:"Factorial",

  sampleInput:`5`,

  sampleOutput:`120`,

  constraints:"0 ≤ N ≤ 20",

  explanation:"Use math.factorial().",

  examples:[
    {
      input:`6`,
      output:`720`
    }
  ],

  runTestCases:[
    {
      input:`0`,
      output:`1`
    }
  ],

  hiddenTestCases:[
    {
      input:`8`,
      output:`40320`
    }
  ],

  starterCode:`import math

n=int(input())

# Write your code here`,

  tags:["math"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Generate Random Number
// =======================

{
  id:3,
  language:"python",
  concept:"modules",
  difficulty:"medium",
  xp:50,

  title:"Generate Random Number",

  statement:
  "Generate a random integer between 1 and 100 using the random module.",

  inputFormat:"No Input",

  outputFormat:"Random Integer",

  sampleInput:` `,

  sampleOutput:`57`,

  constraints:"Output between 1 and 100.",

  explanation:"Use random.randint().",

  examples:[
    {
      input:` `,
      output:`Any value from 1 to 100`
    }
  ],

  runTestCases:[
    {
      input:` `,
      output:`1-100`
    }
  ],

  hiddenTestCases:[],

  starterCode:`import random

# Write your code here`,

  tags:["random"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Current Date and Time
// =======================

{
  id:4,
  language:"python",
  concept:"modules",
  difficulty:"medium",
  xp:65,

  title:"Current Date and Time",

  statement:
  "Print the current date and time using the datetime module.",

  inputFormat:"No Input",

  outputFormat:"Current Date Time",

  sampleInput:` `,

  sampleOutput:`2026-07-19 12:30:45`,

  constraints:"None",

  explanation:"Use datetime.now().",

  examples:[
    {
      input:` `,
      output:`Current Date`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`from datetime import datetime

# Write your code here`,

  tags:["datetime"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. OS Module
// =======================

{
  id:5,
  language:"python",
  concept:"modules",
  difficulty:"medium",
  xp:80,

  title:"Current Working Directory",

  statement:
  "Print the current working directory using the os module.",

  inputFormat:"No Input",

  outputFormat:"Current Directory",

  sampleInput:` `,

  sampleOutput:`C:\\Users\\Student`,

  constraints:"None",

  explanation:"Use os.getcwd().",

  examples:[
    {
      input:` `,
      output:`Directory Path`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`import os

# Write your code here`,

  tags:["os"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Statistics Module
// =======================

{
  id:6,
  language:"python",
  concept:"modules",
  difficulty:"medium",
  xp:90,

  title:"Calculate Mean",

  statement:
  "Read a list of integers and print the mean using the statistics module.",

  inputFormat:
  "N\nList Elements",

  outputFormat:"Mean",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`30`,

  constraints:"1 ≤ N ≤ 1000",

  explanation:"Use statistics.mean().",

  examples:[
    {
      input:`4
1 2 3 4`,
      output:`2.5`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`import statistics

n=int(input())
arr=list(map(int,input().split()))

# Write your code here`,

  tags:["statistics"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Collections Counter
// =======================

{
  id:7,
  language:"python",
  concept:"modules",
  difficulty:"hard",
  xp:100,

  title:"Character Frequency",

  statement:
  "Read a string and print the frequency of each character using collections.Counter.",

  inputFormat:"String",

  outputFormat:"Character Frequency",

  sampleInput:`banana`,

  sampleOutput:`{'b':1,'a':3,'n':2}`,

  constraints:"Length ≤ 1000",

  explanation:"Use Counter from collections.",

  examples:[
    {
      input:`apple`,
      output:`{'a':1,'p':2,'l':1,'e':1}`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`from collections import Counter

s=input()

# Write your code here`,

  tags:["collections"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Itertools Permutations
// =======================

{
  id:8,
  language:"python",
  concept:"modules",
  difficulty:"hard",
  xp:110,

  title:"Generate Permutations",

  statement:
  "Generate all permutations of a given string using itertools.",

  inputFormat:"String",

  outputFormat:"All Permutations",

  sampleInput:`ABC`,

  sampleOutput:`ABC
ACB
BAC
BCA
CAB
CBA`,

  constraints:"Length ≤ 6",

  explanation:"Use itertools.permutations().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`from itertools import permutations

s=input()

# Write your code here`,

  tags:["itertools"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Regular Expressions
// =======================

{
  id:9,
  language:"python",
  concept:"modules",
  difficulty:"hard",
  xp:120,

  title:"Validate Email",

  statement:
  "Read an email address and determine whether it is valid using the re module.",

  inputFormat:"Email Address",

  outputFormat:"Valid or Invalid",

  sampleInput:`abc@gmail.com`,

  sampleOutput:`Valid`,

  constraints:"Valid email format.",

  explanation:"Use re.fullmatch().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`import re

email=input()

# Write your code here`,

  tags:["re"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Build Your Own Module
// =======================

{
  id:10,
  language:"python",
  concept:"modules",
  difficulty:"hard",
  xp:140,

  title:"Create and Import a Custom Module",

  statement:
  "Create a custom module named calculator.py with add() and subtract() functions. Import the module and perform the requested operation.",

  inputFormat:
  "Two integers",

  outputFormat:
  "Addition and Subtraction",

  sampleInput:`10
5`,

  sampleOutput:`15
5`,

  constraints:"-10^9 ≤ Numbers ≤ 10^9",

  explanation:
  "Create your own Python module and import it into another program.",

  examples:[
    {
      input:`20
10`,
      output:`30
10`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`# calculator.py

def add(a,b):
    pass

def subtract(a,b):
    pass

# main.py
import calculator

# Write your code here`,

  tags:["Custom Module","Import"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},


],
pointers:[
  // =======================
// 1. Print Value using Pointer
// =======================

{
  id:1,
  language:"c",
  concept:"pointers",
  difficulty:"easy",
  xp:20,

  title:"Print Value using Pointer",

  statement:
  "Read an integer, store its address in a pointer, and print the value using the pointer.",

  inputFormat:
  "A single integer.",

  outputFormat:
  "Integer value.",

  sampleInput:`25`,

  sampleOutput:`25`,

  constraints:
  "-10^9 ≤ N ≤ 10^9",

  explanation:
  "Declare an integer pointer and dereference it to print the value.",

  examples:[
    {
      input:`100`,
      output:`100`
    }
  ],

  runTestCases:[
    {
      input:`50`,
      output:`50`
    }
  ],

  hiddenTestCases:[
    {
      input:`-25`,
      output:`-25`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    int n;

    scanf("%d",&n);

    // Write your code here

    return 0;
}`,

  tags:["Pointer","Dereference"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Swap Two Numbers using Pointers
// =======================

{
  id:2,
  language:"c",
  concept:"pointers",
  difficulty:"easy",
  xp:35,

  title:"Swap Two Numbers using Pointers",

  statement:
  "Read two integers and swap them using pointers.",

  inputFormat:
  "Two integers.",

  outputFormat:
  "Swapped numbers.",

  sampleInput:`10 20`,

  sampleOutput:`20 10`,

  constraints:
  "-10^9 ≤ Numbers ≤ 10^9",

  explanation:
  "Pass the addresses of both variables to a swap function.",

  examples:[
    {
      input:`5 15`,
      output:`15 5`
    }
  ],

  runTestCases:[
    {
      input:`1 2`,
      output:`2 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`100 200`,
      output:`200 100`
    }
  ],

  starterCode:`#include<stdio.h>

void swap(int *a,int *b){

    // Write your code

}

int main(){

    int a,b;

    scanf("%d%d",&a,&b);

    swap(&a,&b);

    printf("%d %d",a,b);

}`,

  tags:["Pointers","Swap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Sum of Array using Pointer
// =======================

{
  id:3,
  language:"c",
  concept:"pointers",
  difficulty:"medium",
  xp:50,

  title:"Sum of Array using Pointer",

  statement:
  "Read an array and calculate its sum using pointer arithmetic.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Sum of array.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`15`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the array using a pointer instead of array indexing.",

  examples:[
    {
      input:`4
10 20 30 40`,
      output:`100`
    }
  ],

  runTestCases:[
    {
      input:`3
5 5 5`,
      output:`15`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 200`,
      output:`300`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    int n;

    scanf("%d",&n);

    int arr[n];

    // Write your code

}`,

  tags:["Pointer Arithmetic","Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Largest Element using Pointer
// =======================

{
  id:4,
  language:"c",
  concept:"pointers",
  difficulty:"medium",
  xp:65,

  title:"Largest Element using Pointer",

  statement:
  "Find the largest element in an array using pointers.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Largest Element.",

  sampleInput:`5
4 8 2 15 9`,

  sampleOutput:`15`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the array using pointer arithmetic.",

  examples:[
    {
      input:`4
5 2 7 1`,
      output:`7`
    }
  ],

  runTestCases:[
    {
      input:`3
100 20 50`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
-5 -1`,
      output:`-1`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    // Write your code

}`,

  tags:["Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Reverse Array using Pointer
// =======================

{
  id:5,
  language:"c",
  concept:"pointers",
  difficulty:"medium",
  xp:80,

  title:"Reverse Array using Pointer",

  statement:
  "Reverse the elements of an array using pointers.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Reversed Array.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`5 4 3 2 1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use two pointers, one at the beginning and one at the end of the array.",

  examples:[
    {
      input:`4
10 20 30 40`,
      output:`40 30 20 10`
    }
  ],

  runTestCases:[
    {
      input:`3
7 8 9`,
      output:`9 8 7`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
1 2`,
      output:`2 1`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    // Write your code

}`,

  tags:["Pointers","Arrays"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Pointer to Pointer
// =======================

{
  id:6,
  language:"c",
  concept:"pointers",
  difficulty:"medium",
  xp:90,

  title:"Pointer to Pointer",

  statement:
  "Read an integer. Create a pointer and a pointer to that pointer. Print the value using the double pointer.",

  inputFormat:
  "A single integer.",

  outputFormat:
  "Integer value.",

  sampleInput:`50`,

  sampleOutput:`50`,

  constraints:
  "-10^9 ≤ N ≤ 10^9",

  explanation:
  "A pointer to pointer stores the address of another pointer. Dereference twice to access the original value.",

  examples:[
    {
      input:`100`,
      output:`100`
    }
  ],

  runTestCases:[
    {
      input:`25`,
      output:`25`
    }
  ],

  hiddenTestCases:[
    {
      input:`-15`,
      output:`-15`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    int n;

    scanf("%d",&n);

    // Write your code here

    return 0;
}`,

  tags:["Double Pointer"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. String Traversal using Pointer
// =======================

{
  id:7,
  language:"c",
  concept:"pointers",
  difficulty:"medium",
  xp:100,

  title:"Traverse String using Pointer",

  statement:
  "Read a string and print each character using only a character pointer.",

  inputFormat:
  "A string.",

  outputFormat:
  "Characters of the string.",

  sampleInput:`Hello`,

  sampleOutput:`Hello`,

  constraints:
  "Length ≤ 1000",

  explanation:
  "Traverse the string by incrementing the pointer until the null character.",

  examples:[
    {
      input:`OpenAI`,
      output:`OpenAI`
    }
  ],

  runTestCases:[
    {
      input:`Programming`,
      output:`Programming`
    }
  ],

  hiddenTestCases:[
    {
      input:`Pointer`,
      output:`Pointer`
    }
  ],

  starterCode:`#include<stdio.h>

int main(){

    char str[1000];

    scanf("%s",str);

    // Write your code here

}`,

  tags:["String","Pointer"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Dynamic Memory Allocation
// =======================

{
  id:8,
  language:"c",
  concept:"pointers",
  difficulty:"hard",
  xp:110,

  title:"Dynamic Memory Allocation using malloc",

  statement:
  "Read N integers, allocate memory dynamically using malloc(), store the integers and print them.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Array Elements.",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`1 2 3 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use malloc() to allocate memory and free() after use.",

  examples:[
    {
      input:`3
10 20 30`,
      output:`10 20 30`
    }
  ],

  runTestCases:[
    {
      input:`2
50 60`,
      output:`50 60`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
99`,
      output:`99`
    }
  ],

  starterCode:`#include<stdio.h>
#include<stdlib.h>

int main(){

    int n;

    scanf("%d",&n);

    // Write your code here

}`,

  tags:["malloc","Dynamic Memory"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Function Returning Pointer
// =======================

{
  id:9,
  language:"c",
  concept:"pointers",
  difficulty:"hard",
  xp:120,

  title:"Function Returning Pointer",

  statement:
  "Create a function that returns a pointer to the largest element of an array. Print the largest element using the returned pointer.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Largest Element.",

  sampleInput:`5
10 50 20 80 40`,

  sampleOutput:`80`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Return the address of the maximum element from the function.",

  examples:[
    {
      input:`4
5 7 3 9`,
      output:`9`
    }
  ],

  runTestCases:[
    {
      input:`3
100 20 30`,
      output:`100`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
-5 -1`,
      output:`-1`
    }
  ],

  starterCode:`#include<stdio.h>

int* largest(int arr[],int n){

    // Write your code here

}

int main(){

    // Write your code here

}`,

  tags:["Function","Pointer"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Linked List Creation using Pointers
// =======================

{
  id:10,
  language:"c",
  concept:"pointers",
  difficulty:"hard",
  xp:140,

  title:"Create a Singly Linked List",

  statement:
  "Read N integers and create a singly linked list using pointers. Print all the elements in the linked list.",

  inputFormat:
  "N\nList Elements",

  outputFormat:
  "Linked List Elements.",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`10 20 30 40 50`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Create nodes dynamically using malloc() and connect them using next pointers.",

  examples:[
    {
      input:`3
1 2 3`,
      output:`1 2 3`
    }
  ],

  runTestCases:[
    {
      input:`2
100 200`,
      output:`100 200`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
500`,
      output:`500`
    }
  ],

  starterCode:`#include<stdio.h>
#include<stdlib.h>

struct Node{

    int data;

    struct Node *next;

};

int main(){

    // Write your code here

}`,

  tags:["Pointers","Linked List","malloc"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

structures:[
  // =======================
// 1. Store and Display Student Details
// =======================

{
  id:1,
  language:"c",
  concept:"structures",
  difficulty:"easy",
  xp:20,

  title:"Store and Display Student Details",

  statement:
  "Create a structure named Student containing roll number, name, and marks. Read the details of one student and display them.",

  inputFormat:
  "Roll Number\nName\nMarks",

  outputFormat:
  "Student Details",

  sampleInput:`101
John
85.5`,

  sampleOutput:`101
John
85.50`,

  constraints:
  "Roll Number ≤ 100000",

  explanation:
  "Use a structure to store multiple attributes of a student.",

  examples:[
    {
      input:`1
Alice
90`,
      output:`1
Alice
90.00`
    }
  ],

  runTestCases:[
    {
      input:`10
David
75.5`,
      output:`10
David
75.50`
    }
  ],

  hiddenTestCases:[
    {
      input:`20
Tom
100`,
      output:`20
Tom
100.00`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Structure","Student"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employee Salary
// =======================

{
  id:2,
  language:"c",
  concept:"structures",
  difficulty:"easy",
  xp:35,

  title:"Employee Salary",

  statement:
  "Create a structure Employee containing employee ID, name, and salary. Read and print the employee details.",

  inputFormat:
  "Employee ID\nName\nSalary",

  outputFormat:
  "Employee Details",

  sampleInput:`1001
Rahul
45000`,

  sampleOutput:`1001
Rahul
45000.00`,

  constraints:
  "Salary > 0",

  explanation:
  "Store employee information using structures.",

  examples:[
    {
      input:`10
John
30000`,
      output:`10
John
30000.00`
    }
  ],

  runTestCases:[
    {
      input:`20
David
50000`,
      output:`20
David
50000.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`30
Alice
60000`,
      output:`30
Alice
60000.00`
    }
  ],

  starterCode:`#include<stdio.h>

struct Employee{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Structure"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Find Oldest Student
// =======================

{
  id:3,
  language:"c",
  concept:"structures",
  difficulty:"medium",
  xp:50,

  title:"Find Oldest Student",

  statement:
  "Read details of N students (name and age). Print the name of the oldest student.",

  inputFormat:
  "N\nName Age",

  outputFormat:
  "Oldest Student Name",

  sampleInput:`3
John 20
Alice 22
David 21`,

  sampleOutput:`Alice`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Store student records in an array of structures.",

  examples:[
    {
      input:`2
Tom 18
Jerry 19`,
      output:`Jerry`
    }
  ],

  runTestCases:[
    {
      input:`3
A 30
B 25
C 35`,
      output:`C`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
Riya 50`,
      output:`Riya`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Array of Structures"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Sort Students by Marks
// =======================

{
  id:4,
  language:"c",
  concept:"structures",
  difficulty:"medium",
  xp:65,

  title:"Sort Students by Marks",

  statement:
  "Read details of N students and print them in ascending order of marks.",

  inputFormat:
  "N\nRoll Name Marks",

  outputFormat:
  "Sorted Student Records",

  sampleInput:`3
1 John 90
2 Alice 80
3 David 85`,

  sampleOutput:`2 Alice 80
3 David 85
1 John 90`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Sort an array of structures based on marks.",

  examples:[
    {
      input:`2
1 A 10
2 B 5`,
      output:`2 B 5
1 A 10`
    }
  ],

  runTestCases:[
    {
      input:`2
10 X 60
20 Y 40`,
      output:`20 Y 40
10 X 60`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
1 Z 100`,
      output:`1 Z 100`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Sorting","Structures"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Structure as Function Argument
// =======================

{
  id:5,
  language:"c",
  concept:"structures",
  difficulty:"medium",
  xp:80,

  title:"Pass Structure to Function",

  statement:
  "Create a structure Student and pass it to a function that prints the student's details.",

  inputFormat:
  "Roll\nName\nMarks",

  outputFormat:
  "Student Details",

  sampleInput:`101
John
88`,

  sampleOutput:`101
John
88.00`,

  constraints:
  "None",

  explanation:
  "Pass a structure variable as a function argument.",

  examples:[
    {
      input:`10
A
50`,
      output:`10
A
50.00`
    }
  ],

  runTestCases:[
    {
      input:`20
B
99`,
      output:`20
B
99.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`30
C
100`,
      output:`30
C
100.00`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Declare members

};

void display(struct Student s){

    // Write your code

}

int main(){

    // Write your code here

}`,

  tags:["Structures","Functions"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Pointer to Structure
// =======================

{
  id:6,
  language:"c",
  concept:"structures",
  difficulty:"medium",
  xp:90,

  title:"Pointer to Structure",

  statement:
  "Create a structure Student. Read the student details using a structure pointer and display them using the arrow (->) operator.",

  inputFormat:
  "Roll Number\nName\nMarks",

  outputFormat:
  "Student Details",

  sampleInput:`101
John
89.5`,

  sampleOutput:`101
John
89.50`,

  constraints:
  "Marks ≥ 0",

  explanation:
  "Use a pointer to access structure members with the -> operator.",

  examples:[
    {
      input:`1
Alice
95`,
      output:`1
Alice
95.00`
    }
  ],

  runTestCases:[
    {
      input:`10
David
75`,
      output:`10
David
75.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`20
Tom
100`,
      output:`20
Tom
100.00`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Pointer","Structure"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Nested Structures
// =======================

{
  id:7,
  language:"c",
  concept:"structures",
  difficulty:"hard",
  xp:100,

  title:"Nested Structures",

  statement:
  "Create a structure Employee containing another structure Address. Read and display employee details along with city and pincode.",

  inputFormat:
  "ID\nName\nCity\nPincode",

  outputFormat:
  "Employee Details",

  sampleInput:`1001
Rahul
Chennai
600001`,

  sampleOutput:`1001 Rahul Chennai 600001`,

  constraints:
  "Pincode is a 6-digit number.",

  explanation:
  "A structure can contain another structure as one of its members.",

  examples:[
    {
      input:`101
Alice
Delhi
110001`,
      output:`101 Alice Delhi 110001`
    }
  ],

  runTestCases:[
    {
      input:`1
John
Mumbai
400001`,
      output:`1 John Mumbai 400001`
    }
  ],

  hiddenTestCases:[
    {
      input:`10
David
Bangalore
560001`,
      output:`10 David Bangalore 560001`
    }
  ],

  starterCode:`#include<stdio.h>

struct Address{

    // Members

};

struct Employee{

    // Members

};

int main(){

    // Write your code here

}`,

  tags:["Nested Structure"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Array of Employee Structures
// =======================

{
  id:8,
  language:"c",
  concept:"structures",
  difficulty:"hard",
  xp:110,

  title:"Highest Salary Employee",

  statement:
  "Read details of N employees and print the employee having the highest salary.",

  inputFormat:
  "N\nID Name Salary",

  outputFormat:
  "Employee Details",

  sampleInput:`3
101 John 25000
102 Alice 45000
103 David 35000`,

  sampleOutput:`102 Alice 45000`,

  constraints:
  "1 ≤ N ≤ 1000",

  explanation:
  "Store employee records in an array of structures and find the maximum salary.",

  examples:[
    {
      input:`2
1 Tom 1000
2 Jerry 2000`,
      output:`2 Jerry 2000`
    }
  ],

  runTestCases:[
    {
      input:`2
10 A 8000
20 B 9000`,
      output:`20 B 9000`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
5 Ram 10000`,
      output:`5 Ram 10000`
    }
  ],

  starterCode:`#include<stdio.h>

struct Employee{

    // Declare members

};

int main(){

    // Write your code here

}`,

  tags:["Array of Structures"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Dynamic Memory Allocation for Structure
// =======================

{
  id:9,
  language:"c",
  concept:"structures",
  difficulty:"hard",
  xp:120,

  title:"Dynamic Structure Allocation",

  statement:
  "Allocate memory dynamically for a Student structure using malloc(). Read the student details and display them.",

  inputFormat:
  "Roll Number\nName\nMarks",

  outputFormat:
  "Student Details",

  sampleInput:`101
John
85`,

  sampleOutput:`101 John 85.00`,

  constraints:
  "Marks ≥ 0",

  explanation:
  "Allocate memory for the structure using malloc() and access members using ->.",

  examples:[
    {
      input:`10
Alice
90`,
      output:`10 Alice 90.00`
    }
  ],

  runTestCases:[
    {
      input:`20
David
75`,
      output:`20 David 75.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
Tom
100`,
      output:`1 Tom 100.00`
    }
  ],

  starterCode:`#include<stdio.h>
#include<stdlib.h>

struct Student{

    // Members

};

int main(){

    // Write your code here

}`,

  tags:["malloc","Structure"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Student Management System
// =======================

{
  id:10,
  language:"c",
  concept:"structures",
  difficulty:"hard",
  xp:140,

  title:"Student Management System",

  statement:
  "Create a menu-driven Student Management System using structures. Support Add Student, Search Student by Roll Number, Update Marks, Delete Student and Display All Students.",

  inputFormat:
  "Choice followed by required inputs.",

  outputFormat:
  "Requested Result.",

  sampleInput:`5
1
101 John 85
4`,

  sampleOutput:`101 John 85.00`,

  constraints:
  "Maximum 100 students.",

  explanation:
  "Implement CRUD operations using an array of structures.",

  examples:[
    {
      input:`1
1 Alice 90
4`,
      output:`1 Alice 90.00`
    }
  ],

  runTestCases:[
    {
      input:`1
2 Bob 80
2
2`,
      output:`2 Bob 80.00`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
5 Tom 100
3
5 95
4`,
      output:`5 Tom 95.00`
    }
  ],

  starterCode:`#include<stdio.h>

struct Student{

    // Members

};

int main(){

    // Write your code here

}`,

  tags:["Structures","CRUD","Menu Driven"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},


],

stl:[
  // =======================
// 1. Vector Operations
// =======================

{
  id:1,
  language:"cpp",
  concept:"stl",
  difficulty:"easy",
  xp:20,

  title:"Vector Operations",

  statement:
  "Read N integers into a vector. Print the size of the vector followed by all its elements.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Vector size\nVector elements",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`5
1 2 3 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use vector, push_back(), size(), and indexing.",

  examples:[
    {
      input:`3
10 20 30`,
      output:`3
10 20 30`
    }
  ],

  runTestCases:[
    {
      input:`2
7 8`,
      output:`2
7 8`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
100`,
      output:`1
100`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Sort a Vector
// =======================

{
  id:2,
  language:"cpp",
  concept:"stl",
  difficulty:"easy",
  xp:35,

  title:"Sort a Vector",

  statement:
  "Read N integers into a vector and sort them in ascending order.",

  inputFormat:
  "N\nVector Elements",

  outputFormat:
  "Sorted Vector",

  sampleInput:`5
5 2 1 4 3`,

  sampleOutput:`1 2 3 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use sort() from the algorithm library.",

  examples:[
    {
      input:`3
9 1 5`,
      output:`1 5 9`
    }
  ],

  runTestCases:[
    {
      input:`4
8 6 7 2`,
      output:`2 6 7 8`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 50`,
      output:`50 100`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Sort"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Frequency using Map
// =======================

{
  id:3,
  language:"cpp",
  concept:"stl",
  difficulty:"medium",
  xp:50,

  title:"Frequency Count using Map",

  statement:
  "Read N integers and print the frequency of each element using map.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Element Frequency",

  sampleInput:`5
1 2 2 3 3`,

  sampleOutput:`1 1
2 2
3 2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use map<int,int> to store frequencies.",

  examples:[
    {
      input:`4
5 5 6 7`,
      output:`5 2
6 1
7 1`
    }
  ],

  runTestCases:[
    {
      input:`3
10 10 20`,
      output:`10 2
20 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
1 1`,
      output:`1 2`
    }
  ],

  starterCode:`#include<iostream>
#include<map>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Map"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Remove Duplicates using Set
// =======================

{
  id:4,
  language:"cpp",
  concept:"stl",
  difficulty:"medium",
  xp:65,

  title:"Remove Duplicates using Set",

  statement:
  "Read N integers and print the unique elements in ascending order using set.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Unique Elements",

  sampleInput:`6
4 2 2 5 4 1`,

  sampleOutput:`1 2 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "A set automatically removes duplicates and stores elements in sorted order.",

  examples:[
    {
      input:`4
7 7 8 9`,
      output:`7 8 9`
    }
  ],

  runTestCases:[
    {
      input:`3
5 5 5`,
      output:`5`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
3 2 1 2 3`,
      output:`1 2 3`
    }
  ],

  starterCode:`#include<iostream>
#include<set>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Set"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Queue Simulation
// =======================

{
  id:5,
  language:"cpp",
  concept:"stl",
  difficulty:"medium",
  xp:80,

  title:"Queue Operations",

  statement:
  "Read N integers, insert them into a queue and print the elements in FIFO order.",

  inputFormat:
  "N\nQueue Elements",

  outputFormat:
  "Queue Elements",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`10 20 30 40 50`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use queue, push(), front(), pop() and empty().",

  examples:[
    {
      input:`3
5 6 7`,
      output:`5 6 7`
    }
  ],

  runTestCases:[
    {
      input:`2
100 200`,
      output:`100 200`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
500`,
      output:`500`
    }
  ],

  starterCode:`#include<iostream>
#include<queue>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Queue"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Stack Operations
// =======================

{
  id:6,
  language:"cpp",
  concept:"stl",
  difficulty:"medium",
  xp:90,

  title:"Stack Operations",

  statement:
  "Read N integers, push them into a stack and print the elements by popping from the stack.",

  inputFormat:
  "N\nStack Elements",

  outputFormat:
  "Elements in LIFO order.",

  sampleInput:`5
10 20 30 40 50`,

  sampleOutput:`50 40 30 20 10`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use stack, push(), top(), pop() and empty().",

  examples:[
    {
      input:`3
1 2 3`,
      output:`3 2 1`
    }
  ],

  runTestCases:[
    {
      input:`2
100 200`,
      output:`200 100`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
500`,
      output:`500`
    }
  ],

  starterCode:`#include<iostream>
#include<stack>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Stack"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Priority Queue (Max Heap)
// =======================

{
  id:7,
  language:"cpp",
  concept:"stl",
  difficulty:"medium",
  xp:100,

  title:"Priority Queue",

  statement:
  "Read N integers, insert them into a priority queue and print them in descending order.",

  inputFormat:
  "N\nElements",

  outputFormat:
  "Descending Order",

  sampleInput:`5
5 1 8 3 6`,

  sampleOutput:`8 6 5 3 1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use priority_queue which works as a max heap by default.",

  examples:[
    {
      input:`4
10 40 20 30`,
      output:`40 30 20 10`
    }
  ],

  runTestCases:[
    {
      input:`3
1 2 3`,
      output:`3 2 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 50`,
      output:`100 50`
    }
  ],

  starterCode:`#include<iostream>
#include<queue>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Priority Queue","Heap"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Vector of Pairs
// =======================

{
  id:8,
  language:"cpp",
  concept:"stl",
  difficulty:"hard",
  xp:110,

  title:"Vector of Pairs",

  statement:
  "Read N pairs of integers, store them in a vector of pairs and print all pairs.",

  inputFormat:
  "N\nA B",

  outputFormat:
  "Pairs",

  sampleInput:`3
1 10
2 20
3 30`,

  sampleOutput:`1 10
2 20
3 30`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use vector<pair<int,int>>.",

  examples:[
    {
      input:`2
10 100
20 200`,
      output:`10 100
20 200`
    }
  ],

  runTestCases:[
    {
      input:`1
5 50`,
      output:`5 50`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
7 70
8 80`,
      output:`7 70
8 80`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Pair","Vector"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. lower_bound() and upper_bound()
// =======================

{
  id:9,
  language:"cpp",
  concept:"stl",
  difficulty:"hard",
  xp:120,

  title:"Binary Search using STL",

  statement:
  "Given a sorted vector and a target value, print the indices returned by lower_bound() and upper_bound().",

  inputFormat:
  "N\nSorted Elements\nTarget",

  outputFormat:
  "Lower Bound Index\nUpper Bound Index",

  sampleInput:`6
1 2 2 2 4 5
2`,

  sampleOutput:`1
4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use lower_bound() and upper_bound() from the algorithm library.",

  examples:[
    {
      input:`5
10 20 30 40 50
30`,
      output:`2
3`
    }
  ],

  runTestCases:[
    {
      input:`4
1 3 5 7
4`,
      output:`2
2`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 5 5 5 5
5`,
      output:`0
5`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Binary Search","lower_bound","upper_bound"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Top K Frequent Elements (LeetCode #347)
// =======================

{
  id:10,
  language:"cpp",
  concept:"stl",
  difficulty:"hard",
  xp:140,

  title:"Top K Frequent Elements",

  statement:
  "Given an integer array and an integer K, return the K most frequent elements.",

  inputFormat:
  "N\nArray Elements\nK",

  outputFormat:
  "K Most Frequent Elements",

  sampleInput:`6
1 1 1 2 2 3
2`,

  sampleOutput:`1 2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use unordered_map to count frequencies and priority_queue (max heap) to extract the K most frequent elements.",

  examples:[
    {
      input:`5
4 4 5 5 5
1`,
      output:`5`
    }
  ],

  runTestCases:[
    {
      input:`8
7 7 7 8 8 9 9 9
2`,
      output:`7 9`
    }
  ],

  hiddenTestCases:[
    {
      input:`4
10 20 20 30
1`,
      output:`20`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<unordered_map>
#include<queue>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["STL","unordered_map","priority_queue","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

vectors:[
  // =======================
// 1. Create and Print Vector
// =======================

{
  id:1,
  language:"cpp",
  concept:"vectors",
  difficulty:"easy",
  xp:20,

  title:"Create and Print Vector",

  statement:
  "Read N integers, store them in a vector and print all the elements.",

  inputFormat:
  "N\nN integers",

  outputFormat:
  "Vector Elements",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`1 2 3 4 5`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use vector<int> and push_back() to store elements.",

  examples:[
    {
      input:`3
10 20 30`,
      output:`10 20 30`
    }
  ],

  runTestCases:[
    {
      input:`2
7 8`,
      output:`7 8`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
100`,
      output:`100`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Find Maximum Element
// =======================

{
  id:2,
  language:"cpp",
  concept:"vectors",
  difficulty:"easy",
  xp:35,

  title:"Find Maximum Element",

  statement:
  "Read N integers into a vector and print the maximum element.",

  inputFormat:
  "N\nElements",

  outputFormat:
  "Maximum Element",

  sampleInput:`5
5 8 2 10 6`,

  sampleOutput:`10`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Traverse the vector or use max_element().",

  examples:[
    {
      input:`3
20 40 10`,
      output:`40`
    }
  ],

  runTestCases:[
    {
      input:`4
1 2 3 4`,
      output:`4`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
-5 -2`,
      output:`-2`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Reverse Vector
// =======================

{
  id:3,
  language:"cpp",
  concept:"vectors",
  difficulty:"medium",
  xp:50,

  title:"Reverse Vector",

  statement:
  "Read N integers into a vector and print them in reverse order.",

  inputFormat:
  "N\nElements",

  outputFormat:
  "Reversed Vector",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`5 4 3 2 1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use reverse() or reverse iterators.",

  examples:[
    {
      input:`4
10 20 30 40`,
      output:`40 30 20 10`
    }
  ],

  runTestCases:[
    {
      input:`3
7 8 9`,
      output:`9 8 7`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
50`,
      output:`50`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Reverse"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Remove Duplicates
// =======================

{
  id:4,
  language:"cpp",
  concept:"vectors",
  difficulty:"medium",
  xp:65,

  title:"Remove Duplicate Elements",

  statement:
  "Read N integers and remove duplicate elements while maintaining the order of first occurrence.",

  inputFormat:
  "N\nElements",

  outputFormat:
  "Unique Elements",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`1 2 3 4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Maintain insertion order while removing duplicates.",

  examples:[
    {
      input:`5
5 5 6 7 7`,
      output:`5 6 7`
    }
  ],

  runTestCases:[
    {
      input:`4
2 3 2 4`,
      output:`2 3 4`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`9`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<unordered_set>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Hashing"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Rotate Vector Left
// =======================

{
  id:5,
  language:"cpp",
  concept:"vectors",
  difficulty:"medium",
  xp:80,

  title:"Rotate Vector Left",

  statement:
  "Rotate the vector to the left by K positions.",

  inputFormat:
  "N\nElements\nK",

  outputFormat:
  "Rotated Vector",

  sampleInput:`5
1 2 3 4 5
2`,

  sampleOutput:`3 4 5 1 2`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use rotate() from the STL algorithm library.",

  examples:[
    {
      input:`4
10 20 30 40
1`,
      output:`20 30 40 10`
    }
  ],

  runTestCases:[
    {
      input:`6
1 2 3 4 5 6
3`,
      output:`4 5 6 1 2 3`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
5 4 3 2 1
4`,
      output:`1 5 4 3 2`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Rotate"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Insert Element at Position
// =======================

{
  id:6,
  language:"cpp",
  concept:"vectors",
  difficulty:"medium",
  xp:90,

  title:"Insert Element at Position",

  statement:
  "Read N integers into a vector. Insert a given element at a specified position and print the updated vector.",

  inputFormat:
  "N\nVector Elements\nPosition Value",

  outputFormat:
  "Updated Vector",

  sampleInput:`5
10 20 30 40 50
2 25`,

  sampleOutput:`10 20 25 30 40 50`,

  constraints:
  "0 ≤ Position ≤ N",

  explanation:
  "Use vector::insert() to insert an element at the given index.",

  examples:[
    {
      input:`3
1 2 3
1 10`,
      output:`1 10 2 3`
    }
  ],

  runTestCases:[
    {
      input:`2
5 6
0 4`,
      output:`4 5 6`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
100
1 200`,
      output:`100 200`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Insert"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Delete Element at Position
// =======================

{
  id:7,
  language:"cpp",
  concept:"vectors",
  difficulty:"medium",
  xp:100,

  title:"Delete Element at Position",

  statement:
  "Read N integers into a vector. Delete the element at the given position and print the updated vector.",

  inputFormat:
  "N\nVector Elements\nPosition",

  outputFormat:
  "Updated Vector",

  sampleInput:`5
10 20 30 40 50
2`,

  sampleOutput:`10 20 40 50`,

  constraints:
  "0 ≤ Position < N",

  explanation:
  "Use vector::erase() to remove the specified element.",

  examples:[
    {
      input:`4
1 2 3 4
0`,
      output:`2 3 4`
    }
  ],

  runTestCases:[
    {
      input:`3
5 6 7
2`,
      output:`5 6`
    }
  ],

  hiddenTestCases:[
    {
      input:`2
100 200
1`,
      output:`100`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Erase"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Merge Two Sorted Vectors
// =======================

{
  id:8,
  language:"cpp",
  concept:"vectors",
  difficulty:"hard",
  xp:110,

  title:"Merge Two Sorted Vectors",

  statement:
  "Read two sorted vectors and merge them into a single sorted vector.",

  inputFormat:
  "N\nFirst Vector\nM\nSecond Vector",

  outputFormat:
  "Merged Sorted Vector",

  sampleInput:`3
1 3 5
4
2 4 6 8`,

  sampleOutput:`1 2 3 4 5 6 8`,

  constraints:
  "1 ≤ N,M ≤ 100000",

  explanation:
  "Use the two-pointer technique to merge both sorted vectors.",

  examples:[
    {
      input:`2
10 20
2
15 25`,
      output:`10 15 20 25`
    }
  ],

  runTestCases:[
    {
      input:`3
2 4 6
3
1 3 5`,
      output:`1 2 3 4 5 6`
    }
  ],

  hiddenTestCases:[
    {
      input:`1
5
1
10`,
      output:`5 10`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Merge","Two Pointers"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Two Sum (LeetCode #1)
// =======================

{
  id:9,
  language:"cpp",
  concept:"vectors",
  difficulty:"hard",
  xp:120,

  title:"Two Sum",

  statement:
  "Given a vector of integers and a target value, return the indices of the two numbers whose sum equals the target.",

  inputFormat:
  "N\nVector Elements\nTarget",

  outputFormat:
  "Indices",

  sampleInput:`4
2 7 11 15
9`,

  sampleOutput:`0 1`,

  constraints:
  "Exactly one valid answer exists.",

  explanation:
  "Use an unordered_map to solve the problem in O(N) time.",

  examples:[
    {
      input:`3
3 2 4
6`,
      output:`1 2`
    }
  ],

  runTestCases:[
    {
      input:`2
3 3
6`,
      output:`0 1`
    }
  ],

  hiddenTestCases:[
    {
      input:`5
1 2 3 4 5
9`,
      output:`3 4`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<unordered_map>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Hash Map","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Next Greater Element (LeetCode #496)
// =======================

{
  id:10,
  language:"cpp",
  concept:"vectors",
  difficulty:"hard",
  xp:140,

  title:"Next Greater Element",

  statement:
  "Given a vector of integers, print the next greater element for every element. If no greater element exists, print -1.",

  inputFormat:
  "N\nVector Elements",

  outputFormat:
  "Next Greater Elements",

  sampleInput:`4
4 5 2 10`,

  sampleOutput:`5 10 10 -1`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use a stack to efficiently find the next greater element for each position in O(N).",

  examples:[
    {
      input:`5
13 7 6 12 10`,
      output:`-1 12 12 -1 -1`
    }
  ],

  runTestCases:[
    {
      input:`4
1 3 2 4`,
      output:`3 4 4 -1`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 8 7`,
      output:`-1 -1 -1`
    }
  ],

  starterCode:`#include<iostream>
#include<vector>
#include<stack>
using namespace std;

int main(){

    // Write your code here

}`,

  tags:["Vector","Stack","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

templates:[
  // =======================
// 1. Function Template for Addition
// =======================

{
  id:1,
  language:"cpp",
  concept:"templates",
  difficulty:"easy",
  xp:20,

  title:"Generic Addition using Function Template",

  statement:
  "Create a function template that returns the sum of two values. Test it with integers.",

  inputFormat:"Two integers",

  outputFormat:"Sum",

  sampleInput:`10 20`,

  sampleOutput:`30`,

  constraints:"-10^9 ≤ Values ≤ 10^9",

  explanation:"Use a function template to perform generic addition.",

  examples:[{input:`5 8`,output:`13`}],

  runTestCases:[{input:`100 200`,output:`300`}],

  hiddenTestCases:[{input:`-5 10`,output:`5`}],

  starterCode:`#include<iostream>
using namespace std;

template<typename T>
T add(T a,T b){

    // Write your code

}

int main(){

    // Write your code here

}`,

  tags:["Function Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Generic Maximum
// =======================

{
  id:2,
  language:"cpp",
  concept:"templates",
  difficulty:"easy",
  xp:35,

  title:"Find Maximum using Template",

  statement:
  "Create a function template to find the larger of two values.",

  inputFormat:"Two integers",

  outputFormat:"Maximum value",

  sampleInput:`25 10`,

  sampleOutput:`25`,

  constraints:"None",

  explanation:"Return the greater value using a template.",

  examples:[{input:`4 9`,output:`9`}],

  runTestCases:[{input:`50 30`,output:`50`}],

  hiddenTestCases:[{input:`7 7`,output:`7`}],

  starterCode:`#include<iostream>
using namespace std;

template<class T>
T maximum(T a,T b){

    // Write your code

}`,

  tags:["Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Generic Swap
// =======================

{
  id:3,
  language:"cpp",
  concept:"templates",
  difficulty:"easy",
  xp:50,

  title:"Swap using Function Template",

  statement:
  "Swap two values using a function template.",

  inputFormat:"Two integers",

  outputFormat:"Swapped values",

  sampleInput:`5 10`,

  sampleOutput:`10 5`,

  constraints:"None",

  explanation:"Create a generic swap function.",

  examples:[{input:`100 200`,output:`200 100`}],

  runTestCases:[{input:`1 2`,output:`2 1`}],

  hiddenTestCases:[{input:`50 60`,output:`60 50`}],

  starterCode:`#include<iostream>
using namespace std;

template<typename T>
void swapValue(T &a,T &b){

    // Write your code

}`,

  tags:["Swap","Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Generic Array Printer
// =======================

{
  id:4,
  language:"cpp",
  concept:"templates",
  difficulty:"medium",
  xp:65,

  title:"Print Array using Template",

  statement:
  "Create a function template to print elements of an array.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Array Elements",

  sampleInput:`5
1 2 3 4 5`,

  sampleOutput:`1 2 3 4 5`,

  constraints:"1 ≤ N ≤ 1000",

  explanation:"Use template function with array parameter.",

  examples:[{input:`3
10 20 30`,output:`10 20 30`}],

  runTestCases:[{input:`2
5 6`,output:`5 6`}],

  hiddenTestCases:[{input:`1
100`,output:`100`}],

  starterCode:`#include<iostream>
using namespace std;

template<typename T>
void printArray(T arr[],int n){

    // Write your code

}`,

  tags:["Array","Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Class Template
// =======================

{
  id:5,
  language:"cpp",
  concept:"templates",
  difficulty:"medium",
  xp:80,

  title:"Generic Calculator Class",

  statement:
  "Create a class template Calculator that stores two values and prints their sum.",

  inputFormat:"Two integers",

  outputFormat:"Sum",

  sampleInput:`20 30`,

  sampleOutput:`50`,

  constraints:"None",

  explanation:"Implement a generic class template.",

  examples:[{input:`5 5`,output:`10`}],

  runTestCases:[{input:`100 50`,output:`150`}],

  hiddenTestCases:[{input:`7 3`,output:`10`}],

  starterCode:`#include<iostream>
using namespace std;

template<class T>
class Calculator{

    // Write your code

};`,

  tags:["Class Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Generic Minimum
// =======================

{
  id:6,
  language:"cpp",
  concept:"templates",
  difficulty:"medium",
  xp:90,

  title:"Find Minimum using Template",

  statement:
  "Create a function template to find the smaller of two values.",

  inputFormat:"Two integers",

  outputFormat:"Minimum",

  sampleInput:`8 15`,

  sampleOutput:`8`,

  constraints:"None",

  explanation:"Return the smaller value using templates.",

  examples:[{input:`100 20`,output:`20`}],

  runTestCases:[{input:`5 5`,output:`5`}],

  hiddenTestCases:[{input:`-2 7`,output:`-2`}],

  starterCode:`#include<iostream>
using namespace std;

// Write your code`,

  tags:["Template"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Template with Multiple Types
// =======================

{
  id:7,
  language:"cpp",
  concept:"templates",
  difficulty:"hard",
  xp:100,

  title:"Template with Multiple Data Types",

  statement:
  "Create a template function that accepts two different data types and prints them.",

  inputFormat:
  "Integer\nCharacter",

  outputFormat:
  "Both values",

  sampleInput:`10
A`,

  sampleOutput:`10 A`,

  constraints:"None",

  explanation:"Use template<typename T, typename U>.",

  examples:[{input:`5
B`,output:`5 B`}],

  runTestCases:[{input:`25
X`,output:`25 X`}],

  hiddenTestCases:[{input:`99
Z`,output:`99 Z`}],

  starterCode:`#include<iostream>
using namespace std;

// Write your code`,

  tags:["Multiple Templates"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Template Specialization
// =======================

{
  id:8,
  language:"cpp",
  concept:"templates",
  difficulty:"hard",
  xp:110,

  title:"Template Specialization",

  statement:
  "Implement a template specialization for the char data type.",

  inputFormat:
  "Character",

  outputFormat:
  "Customized Output",

  sampleInput:`A`,

  sampleOutput:`Character = A`,

  constraints:"None",

  explanation:"Use explicit template specialization.",

  examples:[{input:`X`,output:`Character = X`}],

  runTestCases:[{input:`Z`,output:`Character = Z`}],

  hiddenTestCases:[{input:`P`,output:`Character = P`}],

  starterCode:`#include<iostream>
using namespace std;

// Write your code`,

  tags:["Specialization"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Generic Stack Class
// =======================

{
  id:9,
  language:"cpp",
  concept:"templates",
  difficulty:"hard",
  xp:120,

  title:"Template Stack",

  statement:
  "Implement a generic stack class using templates with push() and pop() operations.",

  inputFormat:
  "Stack Operations",

  outputFormat:
  "Stack Result",

  sampleInput:`3
10
20
30`,

  sampleOutput:`30 20 10`,

  constraints:"Maximum 100 elements.",

  explanation:"Create a stack using a class template.",

  examples:[{input:`2
5
6`,output:`6 5`}],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`#include<iostream>
using namespace std;

// Write your code`,

  tags:["Template","Stack"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Generic Sorting Function
// =======================

{
  id:10,
  language:"cpp",
  concept:"templates",
  difficulty:"hard",
  xp:140,

  title:"Generic Bubble Sort",

  statement:
  "Implement a generic bubble sort function using templates.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Sorted Array",

  sampleInput:`5
5 2 4 1 3`,

  sampleOutput:`1 2 3 4 5`,

  constraints:"1 ≤ N ≤ 1000",

  explanation:"Use function templates to sort arrays of any data type.",

  examples:[{input:`3
30 20 10`,output:`10 20 30`}],

  runTestCases:[{input:`4
4 3 2 1`,output:`1 2 3 4`}],

  hiddenTestCases:[{input:`2
10 5`,output:`5 10`}],

  starterCode:`#include<iostream>
using namespace std;

// Write your code`,

  tags:["Templates","Sorting"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

dom:[
  // =======================
// 1. Change Heading Text
// =======================

{
  id:1,
  language:"javascript",
  concept:"dom",
  difficulty:"easy",
  xp:20,

  title:"Change Heading Text",

  statement:
  "Given an HTML page containing an <h1> element with id='title', change its text to 'Welcome to JavaScript DOM'.",

  inputFormat:
  "No input.",

  outputFormat:
  "Updated heading text.",

  sampleInput:`<h1 id="title">Hello</h1>`,

  sampleOutput:`Welcome to JavaScript DOM`,

  constraints:
  "The element always exists.",

  explanation:
  "Use document.getElementById() and textContent.",

  examples:[
    {
      input:`<h1 id="title">Home</h1>`,
      output:`Welcome to JavaScript DOM`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","getElementById"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Change Paragraph Color
// =======================

{
  id:2,
  language:"javascript",
  concept:"dom",
  difficulty:"easy",
  xp:35,

  title:"Change Paragraph Color",

  statement:
  "Change the text color of the paragraph with id='para' to blue.",

  inputFormat:"No input.",

  outputFormat:"Paragraph color changed.",

  sampleInput:`<p id="para">Hello</p>`,

  sampleOutput:`Blue colored text`,

  constraints:"Element always exists.",

  explanation:"Use style.color property.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","CSS"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Button Click Counter
// =======================

{
  id:3,
  language:"javascript",
  concept:"dom",
  difficulty:"medium",
  xp:50,

  title:"Button Click Counter",

  statement:
  "Increment and display the number of button clicks whenever the button is pressed.",

  inputFormat:"Button Click Event",

  outputFormat:"Updated count.",

  sampleInput:`Click Button 3 times`,

  sampleOutput:`3`,

  constraints:"None",

  explanation:"Use addEventListener() and update the DOM.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","Events"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Change Image Source
// =======================

{
  id:4,
  language:"javascript",
  concept:"dom",
  difficulty:"medium",
  xp:65,

  title:"Change Image Source",

  statement:
  "Change the image source of an image element when a button is clicked.",

  inputFormat:"Button Click",

  outputFormat:"Image changes.",

  sampleInput:`button click`,

  sampleOutput:`Image Updated`,

  constraints:"Image exists.",

  explanation:"Modify the src attribute.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","Image"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Toggle Dark Mode
// =======================

{
  id:5,
  language:"javascript",
  concept:"dom",
  difficulty:"medium",
  xp:80,

  title:"Toggle Dark Mode",

  statement:
  "Create a button that toggles the webpage between light mode and dark mode by adding or removing a CSS class.",

  inputFormat:"Button Click",

  outputFormat:"Theme changed.",

  sampleInput:`Click Toggle`,

  sampleOutput:`Dark Mode Enabled`,

  constraints:"None",

  explanation:"Use classList.toggle().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","classList"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Create and Append Element
// =======================

{
  id:6,
  language:"javascript",
  concept:"dom",
  difficulty:"medium",
  xp:90,

  title:"Create and Append a Paragraph",

  statement:
  "Create a new paragraph element with the text 'DOM Manipulation Successful' and append it inside a div with id='container'.",

  inputFormat:
  "No input.",

  outputFormat:
  "Paragraph added to the page.",

  sampleInput:`<div id="container"></div>`,

  sampleOutput:`DOM Manipulation Successful`,

  constraints:
  "The container element always exists.",

  explanation:
  "Use createElement(), textContent and appendChild().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","createElement","appendChild"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Remove an Element
// =======================

{
  id:7,
  language:"javascript",
  concept:"dom",
  difficulty:"medium",
  xp:100,

  title:"Remove an Element",

  statement:
  "Remove the paragraph element with id='message' when the Remove button is clicked.",

  inputFormat:
  "Button Click",

  outputFormat:
  "Element removed.",

  sampleInput:`Click Remove Button`,

  sampleOutput:`Paragraph Deleted`,

  constraints:
  "The element always exists.",

  explanation:
  "Use remove() or removeChild().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","remove"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Form Validation
// =======================

{
  id:8,
  language:"javascript",
  concept:"dom",
  difficulty:"hard",
  xp:110,

  title:"Simple Form Validation",

  statement:
  "Validate a form containing Name and Email fields. Display an error message if either field is empty.",

  inputFormat:
  "User Input",

  outputFormat:
  "Validation Message",

  sampleInput:`Name: John
Email:`,

  sampleOutput:`Email is required`,

  constraints:
  "Both fields are mandatory.",

  explanation:
  "Access form values using the DOM and validate before submission.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","Forms","Validation"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. To-Do List Application
// =======================

{
  id:9,
  language:"javascript",
  concept:"dom",
  difficulty:"hard",
  xp:120,

  title:"Build a To-Do List",

  statement:
  "Allow users to enter a task, add it to a list, and delete any task using a Delete button.",

  inputFormat:
  "Task Input",

  outputFormat:
  "Updated Task List",

  sampleInput:`Study DOM`,

  sampleOutput:`• Study DOM`,

  constraints:
  "Task should not be empty.",

  explanation:
  "Use createElement(), appendChild(), addEventListener() and remove().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","CRUD","Events"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Image Slider
// =======================

{
  id:10,
  language:"javascript",
  concept:"dom",
  difficulty:"hard",
  xp:140,

  title:"Image Slider",

  statement:
  "Create an image slider with Next and Previous buttons that cycles through a list of images.",

  inputFormat:
  "Button Click",

  outputFormat:
  "Updated Image",

  sampleInput:`Click Next`,

  sampleOutput:`Displays the next image`,

  constraints:
  "At least two images are available.",

  explanation:
  "Maintain the current image index and update the image src attribute on button clicks.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["DOM","Events","Image Slider"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

objects:[
  // =======================
// 1. Create and Display Object
// =======================

{
  id:1,
  language:"javascript",
  concept:"objects",
  difficulty:"easy",
  xp:20,

  title:"Create and Display an Object",

  statement:
  "Create an object named student with properties name, age, and marks. Print all the property values.",

  inputFormat:
  "Name\nAge\nMarks",

  outputFormat:
  "Student Details",

  sampleInput:`John
20
85`,

  sampleOutput:`John
20
85`,

  constraints:
  "Age ≥ 0",

  explanation:
  "Store values inside an object and access them using dot notation.",

  examples:[
    {
      input:`Alice
21
90`,
      output:`Alice
21
90`
    }
  ],

  runTestCases:[
    {
      input:`David
19
75`,
      output:`David
19
75`
    }
  ],

  hiddenTestCases:[
    {
      input:`Tom
22
100`,
      output:`Tom
22
100`
    }
  ],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","Properties"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Update Object Property
// =======================

{
  id:2,
  language:"javascript",
  concept:"objects",
  difficulty:"easy",
  xp:35,

  title:"Update Object Property",

  statement:
  "Create a student object and update the marks property. Print the updated marks.",

  inputFormat:
  "Name\nMarks\nNew Marks",

  outputFormat:
  "Updated Marks",

  sampleInput:`John
80
95`,

  sampleOutput:`95`,

  constraints:
  "Marks ≥ 0",

  explanation:
  "Modify an existing object property using dot notation.",

  examples:[
    {
      input:`Alice
70
90`,
      output:`90`
    }
  ],

  runTestCases:[
    {
      input:`David
60
75`,
      output:`75`
    }
  ],

  hiddenTestCases:[
    {
      input:`Tom
50
100`,
      output:`100`
    }
  ],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","Update"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Count Object Properties
// =======================

{
  id:3,
  language:"javascript",
  concept:"objects",
  difficulty:"medium",
  xp:50,

  title:"Count Object Properties",

  statement:
  "Given an object, print the total number of properties present in it.",

  inputFormat:
  "Object",

  outputFormat:
  "Number of Properties",

  sampleInput:`{name:'John',age:20,city:'Chennai'}`,

  sampleOutput:`3`,

  constraints:
  "Maximum 100 properties.",

  explanation:
  "Use Object.keys().length.",

  examples:[
    {
      input:`{a:1,b:2}`,
      output:`2`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","Object.keys"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Check Property Exists
// =======================

{
  id:4,
  language:"javascript",
  concept:"objects",
  difficulty:"medium",
  xp:65,

  title:"Check Property Exists",

  statement:
  "Given an object and a property name, determine whether the property exists.",

  inputFormat:
  "Object\nProperty Name",

  outputFormat:
  "True or False",

  sampleInput:`{name:'John',age:20}
age`,

  sampleOutput:`true`,

  constraints:
  "Property names are case-sensitive.",

  explanation:
  "Use the in operator or hasOwnProperty().",

  examples:[
    {
      input:`{x:10}
y`,
      output:`false`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","hasOwnProperty"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Object with Method
// =======================

{
  id:5,
  language:"javascript",
  concept:"objects",
  difficulty:"medium",
  xp:80,

  title:"Object Method",

  statement:
  "Create an object with properties length and breadth, and a method area() that returns the area of a rectangle.",

  inputFormat:
  "Length\nBreadth",

  outputFormat:
  "Area",

  sampleInput:`10
20`,

  sampleOutput:`200`,

  constraints:
  "Length and Breadth > 0",

  explanation:
  "Define methods inside an object using function syntax.",

  examples:[
    {
      input:`5
8`,
      output:`40`
    }
  ],

  runTestCases:[
    {
      input:`7
9`,
      output:`63`
    }
  ],

  hiddenTestCases:[
    {
      input:`100
2`,
      output:`200`
    }
  ],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","Methods"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Iterate Through Object Properties
// =======================

{
  id:6,
  language:"javascript",
  concept:"objects",
  difficulty:"medium",
  xp:90,

  title:"Iterate Through Object Properties",

  statement:
  "Given an object, print all its keys and corresponding values.",

  inputFormat:
  "Object",

  outputFormat:
  "Key Value pairs",

  sampleInput:`{name:'John',age:20,city:'Chennai'}`,

  sampleOutput:`name John
age 20
city Chennai`,

  constraints:
  "Maximum 100 properties.",

  explanation:
  "Use the for...in loop to iterate over object properties.",

  examples:[
    {
      input:`{a:1,b:2}`,
      output:`a 1
b 2`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","for...in"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Merge Two Objects
// =======================

{
  id:7,
  language:"javascript",
  concept:"objects",
  difficulty:"medium",
  xp:100,

  title:"Merge Two Objects",

  statement:
  "Merge two JavaScript objects into a single object. If duplicate keys exist, the second object's value should overwrite the first.",

  inputFormat:
  "Object1\nObject2",

  outputFormat:
  "Merged Object",

  sampleInput:`{a:1,b:2}
{b:5,c:3}`,

  sampleOutput:`{a:1,b:5,c:3}`,

  constraints:
  "Maximum 100 properties.",

  explanation:
  "Use Object.assign() or the spread operator (...).",

  examples:[
    {
      input:`{x:10}
{y:20}`,
      output:`{x:10,y:20}`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","Spread Operator"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Nested Objects
// =======================

{
  id:8,
  language:"javascript",
  concept:"objects",
  difficulty:"hard",
  xp:110,

  title:"Access Nested Object Properties",

  statement:
  "Given a student object containing an address object, print the student's city.",

  inputFormat:
  "Nested Object",

  outputFormat:
  "City",

  sampleInput:`{
name:'John',
address:{city:'Chennai',pincode:600001}
}`,

  sampleOutput:`Chennai`,

  constraints:
  "Address object always exists.",

  explanation:
  "Access nested properties using dot notation.",

  examples:[
    {
      input:`{address:{city:'Delhi'}}`,
      output:`Delhi`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Nested Objects"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Student Management System
// =======================

{
  id:9,
  language:"javascript",
  concept:"objects",
  difficulty:"hard",
  xp:120,

  title:"Student Management using Objects",

  statement:
  "Store student details in an object. Implement Add, Update, Delete and Display operations based on user choice.",

  inputFormat:
  "Choice followed by required input.",

  outputFormat:
  "Updated Student Object",

  sampleInput:`1
John
20
85`,

  sampleOutput:`{name:'John',age:20,marks:85}`,

  constraints:
  "Marks ≥ 0",

  explanation:
  "Perform CRUD operations on a JavaScript object.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","CRUD"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Group Anagrams (LeetCode #49)
// =======================

{
  id:10,
  language:"javascript",
  concept:"objects",
  difficulty:"hard",
  xp:140,

  title:"Group Anagrams",

  statement:
  "Given an array of strings, group all anagrams together and return the grouped arrays.",

  inputFormat:
  "N\nArray of Strings",

  outputFormat:
  "Grouped Anagrams",

  sampleInput:`6
eat tea tan ate nat bat`,

  sampleOutput:`[[eat,tea,ate],[tan,nat],[bat]]`,

  constraints:
  "1 ≤ N ≤ 10000",

  explanation:
  "Use an object (hash map) where the sorted string acts as the key.",

  examples:[
    {
      input:`3
abc bca xyz`,
      output:`[[abc,bca],[xyz]]`
    }
  ],

  runTestCases:[
    {
      input:`2
listen silent`,
      output:`[[listen,silent]]`
    }
  ],

  hiddenTestCases:[
    {
      input:`4
cat tac act dog`,
      output:`[[cat,tac,act],[dog]]`
    }
  ],

  starterCode:`// Write your JavaScript code here`,

  tags:["Object","HashMap","LeetCode"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

promises:[
  // =======================
// 1. Create a Promise
// =======================

{
  id:1,
  language:"javascript",
  concept:"promises",
  difficulty:"easy",
  xp:20,

  title:"Create a Promise",

  statement:
  "Create a Promise that resolves with the message 'Promise Resolved'. Print the resolved value.",

  inputFormat:
  "No input.",

  outputFormat:
  "Promise Resolved",

  sampleInput:`-`,

  sampleOutput:`Promise Resolved`,

  constraints:
  "None",

  explanation:
  "Use the Promise constructor and resolve().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","resolve"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Reject a Promise
// =======================

{
  id:2,
  language:"javascript",
  concept:"promises",
  difficulty:"easy",
  xp:35,

  title:"Reject a Promise",

  statement:
  "Create a Promise that rejects with the message 'Promise Rejected'. Handle the rejection using catch().",

  inputFormat:
  "No input.",

  outputFormat:
  "Promise Rejected",

  sampleInput:`-`,

  sampleOutput:`Promise Rejected`,

  constraints:
  "None",

  explanation:
  "Use reject() and catch().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","catch"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Promise with setTimeout()
// =======================

{
  id:3,
  language:"javascript",
  concept:"promises",
  difficulty:"medium",
  xp:50,

  title:"Resolve Promise after Delay",

  statement:
  "Create a Promise that resolves after 2 seconds with the message 'Task Completed'.",

  inputFormat:
  "No input.",

  outputFormat:
  "Task Completed",

  sampleInput:`-`,

  sampleOutput:`Task Completed`,

  constraints:
  "Delay = 2 seconds",

  explanation:
  "Use setTimeout() inside a Promise.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","setTimeout"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Promise Chaining
// =======================

{
  id:4,
  language:"javascript",
  concept:"promises",
  difficulty:"medium",
  xp:65,

  title:"Promise Chaining",

  statement:
  "Create a Promise chain that adds 10, multiplies by 2, and prints the final result.",

  inputFormat:
  "Initial Integer",

  outputFormat:
  "Final Result",

  sampleInput:`5`,

  sampleOutput:`30`,

  constraints:
  "0 ≤ N ≤ 1000",

  explanation:
  "Use multiple then() methods to chain asynchronous operations.",

  examples:[
    {
      input:`10`,
      output:`40`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","then"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Promise Error Handling
// =======================

{
  id:5,
  language:"javascript",
  concept:"promises",
  difficulty:"medium",
  xp:80,

  title:"Promise Error Handling",

  statement:
  "Throw an error inside a Promise chain and handle it using catch().",

  inputFormat:
  "No input.",

  outputFormat:
  "Error Message",

  sampleInput:`-`,

  sampleOutput:`Something went wrong`,

  constraints:
  "None",

  explanation:
  "Errors inside then() should be handled using catch().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","Error"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Promise.all()
// =======================

{
  id:6,
  language:"javascript",
  concept:"promises",
  difficulty:"hard",
  xp:90,

  title:"Promise.all() Example",

  statement:
  "Execute three Promises simultaneously and print all resolved values once every Promise completes.",

  inputFormat:
  "No input.",

  outputFormat:
  "Resolved Values",

  sampleInput:`-`,

  sampleOutput:`['A','B','C']`,

  constraints:
  "All promises resolve.",

  explanation:
  "Use Promise.all().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise.all"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Promise.race()
// =======================

{
  id:7,
  language:"javascript",
  concept:"promises",
  difficulty:"hard",
  xp:100,

  title:"Promise.race() Example",

  statement:
  "Create three Promises with different delays. Print the value of the Promise that resolves first.",

  inputFormat:
  "No input.",

  outputFormat:
  "Fastest Promise",

  sampleInput:`-`,

  sampleOutput:`Task 2`,

  constraints:
  "At least one Promise resolves.",

  explanation:
  "Use Promise.race().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise.race"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Promise.any()
// =======================

{
  id:8,
  language:"javascript",
  concept:"promises",
  difficulty:"hard",
  xp:110,

  title:"Promise.any() Example",

  statement:
  "Create multiple Promises where some reject and one resolves. Print the first fulfilled value.",

  inputFormat:
  "No input.",

  outputFormat:
  "Resolved Value",

  sampleInput:`-`,

  sampleOutput:`Success`,

  constraints:
  "At least one Promise resolves.",

  explanation:
  "Use Promise.any().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise.any"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Fetch User Data using Promise
// =======================

{
  id:9,
  language:"javascript",
  concept:"promises",
  difficulty:"hard",
  xp:120,

  title:"Simulate API Call",

  statement:
  "Create a Promise that simulates fetching user data after a delay and prints the user object.",

  inputFormat:
  "No input.",

  outputFormat:
  "User Object",

  sampleInput:`-`,

  sampleOutput:`{id:1,name:'John'}`,

  constraints:
  "Delay = 2 seconds.",

  explanation:
  "Simulate an asynchronous API request using Promise and setTimeout().",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Promise","API"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

{
  id: 10,
  language: "javascript",
  concept: "promises",
  difficulty: "hard",
  xp: 140,

  title: "Execute Promises Sequentially",

  statement:
    "Execute three Promises one after another and print their results in order.",

  inputFormat:
    "No input.",

  outputFormat: `Task1
Task2
Task3`,

  sampleInput: `-`,

  sampleOutput: `Task1
Task2
Task3`,

  constraints:
    "All Promises resolve successfully.",

  explanation:
    "Use Promise chaining to execute asynchronous tasks sequentially.",

  examples: [
    {
      input: `-`,
      output: `Task1
Task2
Task3`
    }
  ],

  runTestCases: [
    {
      input: `-`,
      output: `Task1
Task2
Task3`
    }
  ],

  hiddenTestCases: [
    {
      input: `-`,
      output: `Task1
Task2
Task3`
    }
  ],

  starterCode: `// Write your JavaScript code here`,

  tags: ["Promise", "Async"],

  timeLimit: "1 sec",
  memoryLimit: "256 MB"
},

],

asyncAwait:[

  // =======================
// 1. Basic Async Function
// =======================

{
  id:1,
  language:"javascript",
  concept:"async-await",
  difficulty:"easy",
  xp:20,

  title:"Create an Async Function",

  statement:
  "Create an async function that returns the string 'Hello Async'. Print the returned value.",

  inputFormat:
  "No input.",

  outputFormat:
  "Hello Async",

  sampleInput:`-`,

  sampleOutput:`Hello Async`,

  constraints:
  "None",

  explanation:
  "Use the async keyword. Async functions always return a Promise.",

  examples:[
    {
      input:`-`,
      output:`Hello Async`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Function"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Await a Promise
// =======================

{
  id:2,
  language:"javascript",
  concept:"async-await",
  difficulty:"easy",
  xp:35,

  title:"Await a Promise",

  statement:
  "Create a Promise that resolves to 100 and retrieve the value using await.",

  inputFormat:
  "No input.",

  outputFormat:
  "100",

  sampleInput:`-`,

  sampleOutput:`100`,

  constraints:
  "None",

  explanation:
  "Use await to pause execution until the Promise resolves.",

  examples:[
    {
      input:`-`,
      output:`100`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Await","Promise"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Delay using Async/Await
// =======================

{
  id:3,
  language:"javascript",
  concept:"async-await",
  difficulty:"medium",
  xp:50,

  title:"Delay Execution",

  statement:
  "Create a delay of 2 seconds using Promise and await. Print 'Completed' after the delay.",

  inputFormat:
  "No input.",

  outputFormat:
  "Completed",

  sampleInput:`-`,

  sampleOutput:`Completed`,

  constraints:
  "Delay = 2 seconds.",

  explanation:
  "Use setTimeout() inside a Promise and await it.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Delay"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Multiple Await Calls
// =======================

{
  id:4,
  language:"javascript",
  concept:"async-await",
  difficulty:"medium",
  xp:65,

  title:"Execute Multiple Await Calls",

  statement:
  "Create two Promises that resolve with 'Task1' and 'Task2'. Execute them sequentially using await.",

  inputFormat:
  "No input.",

  outputFormat:`Task1
Task2`,

  sampleInput:`-`,

  sampleOutput:`Task1
Task2`,

  constraints:
  "Both Promises resolve.",

  explanation:
  "Await each Promise one after another.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Await"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Async Error Handling
// =======================

{
  id:5,
  language:"javascript",
  concept:"async-await",
  difficulty:"medium",
  xp:80,

  title:"Handle Errors using try...catch",

  statement:
  "Reject a Promise and handle the error using try...catch inside an async function.",

  inputFormat:
  "No input.",

  outputFormat:
  "Promise Failed",

  sampleInput:`-`,

  sampleOutput:`Promise Failed`,

  constraints:
  "None",

  explanation:
  "Use try...catch with await.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","try-catch"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Fetch User Data using Async/Await
// =======================

{
  id:6,
  language:"javascript",
  concept:"async-await",
  difficulty:"hard",
  xp:90,

  title:"Fetch User Data",

  statement:
  "Simulate an API call using a Promise. Retrieve the user object using async/await and print the user's name.",

  inputFormat:
  "No input.",

  outputFormat:
  "John",

  sampleInput:`-`,

  sampleOutput:`John`,

  constraints:
  "The Promise always resolves.",

  explanation:
  "Use await to retrieve data returned by a Promise.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","API"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Execute Promises in Parallel
// =======================

{
  id:7,
  language:"javascript",
  concept:"async-await",
  difficulty:"hard",
  xp:100,

  title:"Execute Promises in Parallel",

  statement:
  "Execute three Promises simultaneously using Promise.all() with async/await and print the resolved values.",

  inputFormat:
  "No input.",

  outputFormat:`Task1
Task2
Task3`,

  sampleInput:`-`,

  sampleOutput:`Task1
Task2
Task3`,

  constraints:
  "All Promises resolve successfully.",

  explanation:
  "Use await Promise.all() to execute Promises concurrently.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Promise.all"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Sequential API Calls
// =======================

{
  id:8,
  language:"javascript",
  concept:"async-await",
  difficulty:"hard",
  xp:110,

  title:"Sequential API Calls",

  statement:
  "Simulate two dependent API calls. Wait for the first response before calling the second API and print both results.",

  inputFormat:
  "No input.",

  outputFormat:`User Loaded
Orders Loaded`,

  sampleInput:`-`,

  sampleOutput:`User Loaded
Orders Loaded`,

  constraints:
  "Both Promises resolve successfully.",

  explanation:
  "Use multiple await statements to execute dependent asynchronous operations.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Sequential"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Retry Failed Async Operation
// =======================

{
  id:9,
  language:"javascript",
  concept:"async-await",
  difficulty:"hard",
  xp:120,

  title:"Retry Failed Async Operation",

  statement:
  "Create an async function that retries a Promise up to three times before throwing an error if it continues to fail.",

  inputFormat:
  "No input.",

  outputFormat:
  "Success or Failed after 3 attempts",

  sampleInput:`-`,

  sampleOutput:`Success`,

  constraints:
  "Maximum retry count is 3.",

  explanation:
  "Use a loop with try...catch inside an async function.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Retry","Error Handling"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Download Multiple Files Concurrently
// =======================

{
  id:10,
  language:"javascript",
  concept:"async-await",
  difficulty:"hard",
  xp:140,

  title:"Download Multiple Files",

  statement:
  "Simulate downloading three files simultaneously using async/await and Promise.all(). Print the file names after all downloads complete.",

  inputFormat:
  "No input.",

  outputFormat:`file1.txt
file2.txt
file3.txt`,

  sampleInput:`-`,

  sampleOutput:`file1.txt
file2.txt
file3.txt`,

  constraints:
  "All downloads complete successfully.",

  explanation:
  "Execute multiple asynchronous tasks concurrently using Promise.all() with await.",

  examples:[],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Async","Promise.all","Concurrency"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

es6:[
  // =======================
// 1. let and const
// =======================

{
  id:1,
  language:"javascript",
  concept:"es6",
  difficulty:"easy",
  xp:20,

  title:"Using let and const",

  statement:
  "Declare a variable using let and another using const. Print both values.",

  inputFormat:
  "An integer and a string.",

  outputFormat:
  "Integer and String",

  sampleInput:`10
Hello`,

  sampleOutput:`10
Hello`,

  constraints:
  "None",

  explanation:
  "Use let for mutable variables and const for constants.",

  examples:[
    {
      input:`5
JavaScript`,
      output:`5
JavaScript`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["ES6","let","const"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Arrow Function
// =======================

{
  id:2,
  language:"javascript",
  concept:"es6",
  difficulty:"easy",
  xp:35,

  title:"Arrow Function Addition",

  statement:
  "Create an arrow function that returns the sum of two numbers.",

  inputFormat:
  "Two integers",

  outputFormat:
  "Sum",

  sampleInput:`15 20`,

  sampleOutput:`35`,

  constraints:
  "None",

  explanation:
  "Use ES6 arrow function syntax.",

  examples:[
    {
      input:`5 6`,
      output:`11`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Arrow Function"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Template Literals
// =======================

{
  id:3,
  language:"javascript",
  concept:"es6",
  difficulty:"easy",
  xp:50,

  title:"Template Literal Greeting",

  statement:
  "Read a person's name and print 'Welcome, <name>!' using template literals.",

  inputFormat:
  "Name",

  outputFormat:
  "Greeting",

  sampleInput:`John`,

  sampleOutput:`Welcome, John!`,

  constraints:
  "Length ≤ 100",

  explanation:
  "Use backticks (`) and ${} interpolation.",

  examples:[
    {
      input:`Alice`,
      output:`Welcome, Alice!`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Template Literal"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Destructuring Assignment
// =======================

{
  id:4,
  language:"javascript",
  concept:"es6",
  difficulty:"medium",
  xp:65,

  title:"Array Destructuring",

  statement:
  "Read three integers into an array and use destructuring to print them individually.",

  inputFormat:
  "Three integers",

  outputFormat:
  "Three integers",

  sampleInput:`10 20 30`,

  sampleOutput:`10
20
30`,

  constraints:
  "None",

  explanation:
  "Use array destructuring syntax.",

  examples:[
    {
      input:`1 2 3`,
      output:`1
2
3`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Destructuring"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Spread Operator
// =======================

{
  id:5,
  language:"javascript",
  concept:"es6",
  difficulty:"medium",
  xp:80,

  title:"Merge Arrays using Spread Operator",

  statement:
  "Merge two arrays into a single array using the spread operator and print the merged array.",

  inputFormat:
  "Two arrays",

  outputFormat:
  "Merged Array",

  sampleInput:`[1,2]
[3,4]`,

  sampleOutput:`[1,2,3,4]`,

  constraints:
  "Maximum array size = 1000",

  explanation:
  "Use the ... operator to merge arrays.",

  examples:[
    {
      input:`[5]
[6,7]`,
      output:`[5,6,7]`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Spread Operator"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
// =======================
// 6. Rest Parameters
// =======================

{
  id:6,
  language:"javascript",
  concept:"es6",
  difficulty:"medium",
  xp:90,

  title:"Sum using Rest Parameters",

  statement:
  "Create a function using rest parameters that accepts any number of integers and returns their sum.",

  inputFormat:
  "Integers",

  outputFormat:
  "Sum",

  sampleInput:`10 20 30 40`,

  sampleOutput:`100`,

  constraints:
  "At least one number is provided.",

  explanation:
  "Use the ...args syntax to receive multiple arguments.",

  examples:[
    {
      input:`1 2 3`,
      output:`6`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Rest Parameters"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Default Parameters
// =======================

{
  id:7,
  language:"javascript",
  concept:"es6",
  difficulty:"medium",
  xp:100,

  title:"Default Function Parameters",

  statement:
  "Create a function greet(name='Guest') that prints a greeting. If no argument is passed, use the default value.",

  inputFormat:
  "Optional Name",

  outputFormat:
  "Greeting Message",

  sampleInput:`John`,

  sampleOutput:`Hello John`,

  constraints:
  "None",

  explanation:
  "Use default parameter values in ES6.",

  examples:[
    {
      input:`-`,
      output:`Hello Guest`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Default Parameters"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. ES6 Classes
// =======================

{
  id:8,
  language:"javascript",
  concept:"es6",
  difficulty:"hard",
  xp:110,

  title:"Create a Class",

  statement:
  "Create a Person class with name and age properties. Add a display() method to print the details.",

  inputFormat:
  "Name\nAge",

  outputFormat:
  "Person Details",

  sampleInput:`John
25`,

  sampleOutput:`John 25`,

  constraints:
  "Age ≥ 0",

  explanation:
  "Use the ES6 class syntax and constructor.",

  examples:[
    {
      input:`Alice
30`,
      output:`Alice 30`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Class","Constructor"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Import and Export Modules
// =======================

{
  id:9,
  language:"javascript",
  concept:"es6",
  difficulty:"hard",
  xp:120,

  title:"ES6 Modules",

  statement:
  "Create a module that exports a function named add(). Import it into another file and print the sum of two numbers.",

  inputFormat:
  "Two integers",

  outputFormat:
  "Sum",

  sampleInput:`15 25`,

  sampleOutput:`40`,

  constraints:
  "None",

  explanation:
  "Use export and import statements in ES6 modules.",

  examples:[
    {
      input:`5 10`,
      output:`15`
    }
  ],

  runTestCases:[],

  hiddenTestCases:[],

  starterCode:`// Write your JavaScript code here`,

  tags:["Modules","Import","Export"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Map and Set Collections
// =======================

{
  id:10,
  language:"javascript",
  concept:"es6",
  difficulty:"hard",
  xp:140,

  title:"Remove Duplicates using Set",

  statement:
  "Given an array of integers, remove duplicate values using the ES6 Set object and print the unique elements.",

  inputFormat:
  "N\nArray Elements",

  outputFormat:
  "Unique Elements",

  sampleInput:`6
1 2 2 3 4 4`,

  sampleOutput:`1 2 3 4`,

  constraints:
  "1 ≤ N ≤ 100000",

  explanation:
  "Use the Set object to automatically remove duplicate values.",

  examples:[
    {
      input:`5
5 5 6 7 7`,
      output:`5 6 7`
    }
  ],

  runTestCases:[
    {
      input:`4
1 1 2 3`,
      output:`1 2 3`
    }
  ],

  hiddenTestCases:[
    {
      input:`3
9 9 9`,
      output:`9`
    }
  ],

  starterCode:`// Write your JavaScript code here`,

  tags:["Set","ES6","Collections"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

select:[
  // =======================
// 1. Select All Columns
// =======================

{
  id:1,
  language:"sql",
  concept:"select",
  difficulty:"easy",
  xp:20,

  title:"Display All Employee Records",

  statement:
  "Write a SQL query to display all columns from the Employees table.",

  inputFormat:
  "Employees(emp_id, name, department, salary)",

  outputFormat:
  "All rows and columns.",

  sampleInput:`Employees
+--------+-------+------------+--------+
| emp_id | name  | department | salary |
+--------+-------+------------+--------+
| 1      | John  | IT         | 50000  |
| 2      | Alice | HR         | 45000  |
`,

  sampleOutput:`+--------+-------+------------+--------+
| 1      | John  | IT         | 50000  |
| 2      | Alice | HR         | 45000  |
`,

  constraints:"None",

  explanation:"Use SELECT *.",

  starterCode:`SELECT ;`,

  tags:["SELECT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Select Specific Columns
// =======================

{
  id:2,
  language:"sql",
  concept:"select",
  difficulty:"easy",
  xp:30,

  title:"Employee Names",

  statement:
  "Display only the employee name and salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "name, salary",

  sampleInput:`Employees`,

  sampleOutput:`John 50000
Alice 45000`,

  constraints:"None",

  explanation:"Select only required columns.",

  starterCode:`SELECT ;`,

  tags:["Columns"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. DISTINCT
// =======================

{
  id:3,
  language:"sql",
  concept:"select",
  difficulty:"easy",
  xp:40,

  title:"Unique Departments",

  statement:
  "Display all unique department names from the Employees table.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Distinct departments",

  sampleInput:`Employees`,

  sampleOutput:`IT
HR
Sales`,

  constraints:"None",

  explanation:"Use DISTINCT.",

  starterCode:`SELECT ;`,

  tags:["DISTINCT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. WHERE Clause
// =======================

{
  id:4,
  language:"sql",
  concept:"select",
  difficulty:"easy",
  xp:50,

  title:"Employees with High Salary",

  statement:
  "Display employees whose salary is greater than 50000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching rows",

  sampleInput:`Employees`,

  sampleOutput:`John IT 60000`,

  constraints:"None",

  explanation:"Use WHERE with comparison operator.",

  starterCode:`SELECT ;`,

  tags:["WHERE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. ORDER BY
// =======================

{
  id:5,
  language:"sql",
  concept:"select",
  difficulty:"medium",
  xp:60,

  title:"Sort Employees",

  statement:
  "Display all employees ordered by salary in descending order.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Sorted rows",

  sampleInput:`Employees`,

  sampleOutput:`David 90000
John 70000
Alice 50000`,

  constraints:"None",

  explanation:"Use ORDER BY salary DESC.",

  starterCode:`SELECT ;`,

  tags:["ORDER BY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. LIMIT
// =======================

{
  id:6,
  language:"sql",
  concept:"select",
  difficulty:"medium",
  xp:70,

  title:"Top 3 Highest Salaries",

  statement:
  "Display the top 3 employees with the highest salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Top 3 rows",

  sampleInput:`Employees`,

  sampleOutput:`David
John
Alice`,

  constraints:"None",

  explanation:"Use ORDER BY and LIMIT.",

  starterCode:`SELECT ;`,

  tags:["LIMIT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. BETWEEN
// =======================

{
  id:7,
  language:"sql",
  concept:"select",
  difficulty:"medium",
  xp:80,

  title:"Salary Range",

  statement:
  "Display employees whose salary is between 30000 and 60000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching rows",

  sampleInput:`Employees`,

  sampleOutput:`Alice
Bob`,

  constraints:"None",

  explanation:"Use BETWEEN.",

  starterCode:`SELECT ;`,

  tags:["BETWEEN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. IN Operator
// =======================

{
  id:8,
  language:"sql",
  concept:"select",
  difficulty:"medium",
  xp:90,

  title:"Selected Departments",

  statement:
  "Display employees working in IT or HR departments.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching rows",

  sampleInput:`Employees`,

  sampleOutput:`John
Alice`,

  constraints:"None",

  explanation:"Use IN operator.",

  starterCode:`SELECT ;`,

  tags:["IN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. LIKE Operator
// =======================

{
  id:9,
  language:"sql",
  concept:"select",
  difficulty:"medium",
  xp:100,

  title:"Names Starting with A",

  statement:
  "Display employees whose names start with the letter 'A'.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching rows",

  sampleInput:`Employees`,

  sampleOutput:`Alice`,

  constraints:"None",

  explanation:"Use LIKE 'A%'.",

  starterCode:`SELECT ;`,

  tags:["LIKE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. IS NULL
// =======================

{
  id:10,
  language:"sql",
  concept:"select",
  difficulty:"hard",
  xp:120,

  title:"Employees Without Manager",

  statement:
  "Display employees whose manager_id is NULL.",

  inputFormat:
  "Employees(emp_id,name,manager_id)",

  outputFormat:
  "Matching employees",

  sampleInput:`Employees`,

  sampleOutput:`John`,

  constraints:"None",

  explanation:"Use IS NULL.",

  starterCode:`SELECT ;`,

  tags:["IS NULL"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

where:[

  // =======================
// 1. Salary Greater Than 50000
// =======================

{
  id:1,
  language:"sql",
  concept:"where",
  difficulty:"easy",
  xp:20,

  title:"Employees with Salary Greater Than 50000",

  statement:
  "Write a SQL query to display all employees whose salary is greater than 50000.",

  inputFormat:
  "Employees(emp_id, name, department, salary)",

  outputFormat:
  "Matching employee records.",

  sampleInput:`Employees`,

  sampleOutput:`John IT 60000`,

  constraints:"None",

  explanation:"Use WHERE salary > 50000.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE",">"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employees from IT Department
// =======================

{
  id:2,
  language:"sql",
  concept:"where",
  difficulty:"easy",
  xp:30,

  title:"Employees in IT Department",

  statement:
  "Display all employees who belong to the IT department.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching employee records.",

  sampleInput:`Employees`,

  sampleOutput:`John IT 50000`,

  constraints:"None",

  explanation:"Use WHERE department='IT'.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","="],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Salary Less Than or Equal to 40000
// =======================

{
  id:3,
  language:"sql",
  concept:"where",
  difficulty:"easy",
  xp:40,

  title:"Employees with Low Salary",

  statement:
  "Display employees whose salary is less than or equal to 40000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`Alice HR 35000`,

  constraints:"None",

  explanation:"Use <= operator.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","<="],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. NOT Equal
// =======================

{
  id:4,
  language:"sql",
  concept:"where",
  difficulty:"easy",
  xp:50,

  title:"Employees Not in HR",

  statement:
  "Display all employees whose department is not HR.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`John IT
David Sales`,

  constraints:"None",

  explanation:"Use != or <>.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","!="],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. AND Operator
// =======================

{
  id:5,
  language:"sql",
  concept:"where",
  difficulty:"medium",
  xp:60,

  title:"IT Employees with High Salary",

  statement:
  "Display employees who work in the IT department and earn more than 60000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`John IT 70000`,

  constraints:"None",

  explanation:"Use AND operator.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","AND"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. OR Operator
// =======================

{
  id:6,
  language:"sql",
  concept:"where",
  difficulty:"medium",
  xp:70,

  title:"Employees in IT or HR",

  statement:
  "Display employees who belong to either the IT or HR department.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`John
Alice`,

  constraints:"None",

  explanation:"Use OR operator.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","OR"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. BETWEEN
// =======================

{
  id:7,
  language:"sql",
  concept:"where",
  difficulty:"medium",
  xp:80,

  title:"Salary Between 30000 and 60000",

  statement:
  "Display employees whose salary is between 30000 and 60000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`Alice
Bob`,

  constraints:"None",

  explanation:"Use BETWEEN operator.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","BETWEEN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. LIKE
// =======================

{
  id:8,
  language:"sql",
  concept:"where",
  difficulty:"medium",
  xp:90,

  title:"Names Starting with S",

  statement:
  "Display employees whose names start with the letter 'S'.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`Steve`,

  constraints:"None",

  explanation:"Use LIKE 'S%'.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","LIKE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. IN Operator
// =======================

{
  id:9,
  language:"sql",
  concept:"where",
  difficulty:"medium",
  xp:100,

  title:"Employees from Selected Departments",

  statement:
  "Display employees working in IT, HR or Finance.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching records.",

  sampleInput:`Employees`,

  sampleOutput:`John
Alice
David`,

  constraints:"None",

  explanation:"Use IN operator.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","IN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. IS NULL
// =======================

{
  id:10,
  language:"sql",
  concept:"where",
  difficulty:"hard",
  xp:120,

  title:"Employees Without Managers",

  statement:
  "Display all employees whose manager_id is NULL.",

  inputFormat:
  "Employees(emp_id, name, manager_id)",

  outputFormat:
  "Matching employee records.",

  sampleInput:`Employees`,

  sampleOutput:`John`,

  constraints:"None",

  explanation:"Use IS NULL inside the WHERE clause.",

  starterCode:`SELECT * FROM Employees
WHERE ;`,

  tags:["WHERE","IS NULL"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

groupBy:[

  // =======================
// 1. Count Employees in Each Department
// =======================

{
  id:1,
  language:"sql",
  concept:"group-by",
  difficulty:"easy",
  xp:20,

  title:"Count Employees by Department",

  statement:
  "Write a SQL query to count the number of employees in each department.",

  inputFormat:
  "Employees(emp_id, name, department, salary)",

  outputFormat:
  "Department and Employee Count",

  sampleInput:`Employees`,

  sampleOutput:`HR 5
IT 8
Sales 4`,

  constraints:"None",

  explanation:"Use GROUP BY department with COUNT().",

  starterCode:`SELECT department, COUNT(*)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","COUNT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Total Salary by Department
// =======================

{
  id:2,
  language:"sql",
  concept:"group-by",
  difficulty:"easy",
  xp:30,

  title:"Department Salary Sum",

  statement:
  "Display the total salary paid in each department.",

  inputFormat:"Employees table",

  outputFormat:"Department and Total Salary",

  sampleInput:`Employees`,

  sampleOutput:`HR 250000
IT 480000`,

  constraints:"None",

  explanation:"Use SUM() with GROUP BY.",

  starterCode:`SELECT department, SUM(salary)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","SUM"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Average Salary by Department
// =======================

{
  id:3,
  language:"sql",
  concept:"group-by",
  difficulty:"easy",
  xp:40,

  title:"Average Salary",

  statement:
  "Display the average salary of each department.",

  inputFormat:"Employees table",

  outputFormat:"Department and Average Salary",

  sampleInput:`Employees`,

  sampleOutput:`HR 50000
IT 60000`,

  constraints:"None",

  explanation:"Use AVG().",

  starterCode:`SELECT department, AVG(salary)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","AVG"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Maximum Salary by Department
// =======================

{
  id:4,
  language:"sql",
  concept:"group-by",
  difficulty:"easy",
  xp:50,

  title:"Highest Salary by Department",

  statement:
  "Find the highest salary in each department.",

  inputFormat:"Employees table",

  outputFormat:"Department and Maximum Salary",

  sampleInput:`Employees`,

  sampleOutput:`IT 90000
HR 70000`,

  constraints:"None",

  explanation:"Use MAX().",

  starterCode:`SELECT department, MAX(salary)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","MAX"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Minimum Salary by Department
// =======================

{
  id:5,
  language:"sql",
  concept:"group-by",
  difficulty:"medium",
  xp:60,

  title:"Lowest Salary by Department",

  statement:
  "Find the minimum salary in each department.",

  inputFormat:"Employees table",

  outputFormat:"Department and Minimum Salary",

  sampleInput:`Employees`,

  sampleOutput:`IT 35000
HR 25000`,

  constraints:"None",

  explanation:"Use MIN().",

  starterCode:`SELECT department, MIN(salary)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","MIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Count Employees by City
// =======================

{
  id:6,
  language:"sql",
  concept:"group-by",
  difficulty:"medium",
  xp:70,

  title:"Employees by City",

  statement:
  "Count the number of employees in each city.",

  inputFormat:
  "Employees(emp_id,name,city)",

  outputFormat:
  "City and Count",

  sampleInput:`Employees`,

  sampleOutput:`Chennai 8
Delhi 5`,

  constraints:"None",

  explanation:"Group records using city.",

  starterCode:`SELECT city, COUNT(*)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Multiple Column GROUP BY
// =======================

{
  id:7,
  language:"sql",
  concept:"group-by",
  difficulty:"medium",
  xp:80,

  title:"Department and Gender Statistics",

  statement:
  "Display the number of employees in each department grouped by gender.",

  inputFormat:
  "Employees(emp_id,name,department,gender)",

  outputFormat:
  "Department Gender Count",

  sampleInput:`Employees`,

  sampleOutput:`IT Male 6
IT Female 4`,

  constraints:"None",

  explanation:"Use GROUP BY with multiple columns.",

  starterCode:`SELECT department, gender, COUNT(*)
FROM Employees
GROUP BY ;`,

  tags:["GROUP BY","Multiple Columns"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Total Orders by Customer
// =======================

{
  id:8,
  language:"sql",
  concept:"group-by",
  difficulty:"medium",
  xp:90,

  title:"Customer Order Count",

  statement:
  "Display the total number of orders placed by each customer.",

  inputFormat:
  "Orders(order_id, customer_id)",

  outputFormat:
  "Customer ID and Order Count",

  sampleInput:`Orders`,

  sampleOutput:`101 5
102 2`,

  constraints:"None",

  explanation:"Use COUNT() with GROUP BY customer_id.",

  starterCode:`SELECT customer_id, COUNT(*)
FROM Orders
GROUP BY ;`,

  tags:["GROUP BY","COUNT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Total Sales by Product
// =======================

{
  id:9,
  language:"sql",
  concept:"group-by",
  difficulty:"hard",
  xp:100,

  title:"Product Sales Summary",

  statement:
  "Calculate the total sales amount for each product.",

  inputFormat:
  "Sales(product_id, amount)",

  outputFormat:
  "Product and Total Sales",

  sampleInput:`Sales`,

  sampleOutput:`P101 25000
P102 18000`,

  constraints:"None",

  explanation:"Use SUM() grouped by product_id.",

  starterCode:`SELECT product_id, SUM(amount)
FROM Sales
GROUP BY ;`,

  tags:["GROUP BY","SUM"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Department with Highest Average Salary
// =======================

{
  id:10,
  language:"sql",
  concept:"group-by",
  difficulty:"hard",
  xp:120,

  title:"Highest Average Salary Department",

  statement:
  "Display the average salary of each department sorted from highest to lowest average salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Department and Average Salary",

  sampleInput:`Employees`,

  sampleOutput:`IT 70000
HR 50000
Sales 42000`,

  constraints:"None",

  explanation:"Use AVG(), GROUP BY and ORDER BY.",

  starterCode:`SELECT department, AVG(salary)
FROM Employees
GROUP BY department
ORDER BY ;`,

  tags:["GROUP BY","AVG","ORDER BY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

join:[

  // =======================
// 1. INNER JOIN
// =======================

{
  id:1,
  language:"sql",
  concept:"join",
  difficulty:"easy",
  xp:20,

  title:"Employee Department Details",

  statement:
  "Write a query to display employee names along with their department names using INNER JOIN.",

  inputFormat:
  "Employees(emp_id, name, dept_id)\nDepartments(dept_id, dept_name)",

  outputFormat:
  "Employee Name and Department Name",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John IT
Alice HR`,

  constraints:"None",

  explanation:"Use INNER JOIN on dept_id.",

  starterCode:`SELECT e.name, d.dept_name
FROM Employees e
INNER JOIN Departments d
ON ;`,

  tags:["INNER JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. LEFT JOIN
// =======================

{
  id:2,
  language:"sql",
  concept:"join",
  difficulty:"easy",
  xp:30,

  title:"All Employees with Departments",

  statement:
  "Display all employees and their department names. Employees without departments should also appear.",

  inputFormat:
  "Employees & Departments",

  outputFormat:
  "Employee Name and Department",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John IT
Alice NULL`,

  constraints:"None",

  explanation:"Use LEFT JOIN.",

  starterCode:`SELECT e.name, d.dept_name
FROM Employees e
LEFT JOIN Departments d
ON ;`,

  tags:["LEFT JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. RIGHT JOIN
// =======================

{
  id:3,
  language:"sql",
  concept:"join",
  difficulty:"easy",
  xp:40,

  title:"All Departments",

  statement:
  "Display all departments along with employee names. Departments without employees should also appear.",

  inputFormat:
  "Employees & Departments",

  outputFormat:
  "Department Name and Employee",

  sampleInput:`Employees & Departments`,

  sampleOutput:`IT John
Finance NULL`,

  constraints:"None",

  explanation:"Use RIGHT JOIN.",

  starterCode:`SELECT d.dept_name, e.name
FROM Employees e
RIGHT JOIN Departments d
ON ;`,

  tags:["RIGHT JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. FULL OUTER JOIN
// =======================

{
  id:4,
  language:"sql",
  concept:"join",
  difficulty:"medium",
  xp:50,

  title:"Complete Employee Department List",

  statement:
  "Display all employees and all departments using FULL OUTER JOIN.",

  inputFormat:
  "Employees & Departments",

  outputFormat:
  "Employee and Department",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John IT
NULL Finance`,

  constraints:"None",

  explanation:"Use FULL OUTER JOIN.",

  starterCode:`SELECT e.name, d.dept_name
FROM Employees e
FULL OUTER JOIN Departments d
ON ;`,

  tags:["FULL JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. CROSS JOIN
// =======================

{
  id:5,
  language:"sql",
  concept:"join",
  difficulty:"medium",
  xp:60,

  title:"Employee Shift Combinations",

  statement:
  "Generate every possible combination of employees and work shifts.",

  inputFormat:
  "Employees & Shifts",

  outputFormat:
  "Employee and Shift",

  sampleInput:`Employees & Shifts`,

  sampleOutput:`John Morning
John Evening
Alice Morning`,

  constraints:"None",

  explanation:"Use CROSS JOIN.",

  starterCode:`SELECT e.name, s.shift_name
FROM Employees e
CROSS JOIN Shifts s;`,

  tags:["CROSS JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. SELF JOIN
// =======================

{
  id:6,
  language:"sql",
  concept:"join",
  difficulty:"medium",
  xp:70,

  title:"Employee and Manager",

  statement:
  "Display employee names along with their manager names using SELF JOIN.",

  inputFormat:
  "Employees(emp_id, name, manager_id)",

  outputFormat:
  "Employee Manager",

  sampleInput:`Employees`,

  sampleOutput:`Alice John`,

  constraints:"None",

  explanation:"Join Employees table with itself.",

  starterCode:`SELECT e.name, m.name
FROM Employees e
JOIN Employees m
ON ;`,

  tags:["SELF JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. JOIN with WHERE
// =======================

{
  id:7,
  language:"sql",
  concept:"join",
  difficulty:"medium",
  xp:80,

  title:"IT Department Employees",

  statement:
  "Display employees who work in the IT department.",

  inputFormat:
  "Employees & Departments",

  outputFormat:
  "Employee Names",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John
David`,

  constraints:"None",

  explanation:"Use INNER JOIN with WHERE clause.",

  starterCode:`SELECT e.name
FROM Employees e
JOIN Departments d
ON e.dept_id=d.dept_id
WHERE ;`,

  tags:["JOIN","WHERE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Three Table JOIN
// =======================

{
  id:8,
  language:"sql",
  concept:"join",
  difficulty:"hard",
  xp:90,

  title:"Employee Project Details",

  statement:
  "Display employee names, department names and project names.",

  inputFormat:
  "Employees, Departments, Projects",

  outputFormat:
  "Employee Department Project",

  sampleInput:`Three Tables`,

  sampleOutput:`John IT Banking App`,

  constraints:"None",

  explanation:"Join three tables together.",

  starterCode:`SELECT e.name,d.dept_name,p.project_name
FROM Employees e
JOIN Departments d
ON e.dept_id=d.dept_id
JOIN Projects p
ON ;`,

  tags:["Multiple JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Highest Salary with Department
// =======================

{
  id:9,
  language:"sql",
  concept:"join",
  difficulty:"hard",
  xp:100,

  title:"Highest Paid Employee",

  statement:
  "Display the employee name, department name and salary of the employee with the highest salary.",

  inputFormat:
  "Employees & Departments",

  outputFormat:
  "Employee Department Salary",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John IT 95000`,

  constraints:"None",

  explanation:"Use JOIN with ORDER BY and LIMIT.",

  starterCode:`SELECT e.name,d.dept_name,e.salary
FROM Employees e
JOIN Departments d
ON e.dept_id=d.dept_id
ORDER BY e.salary DESC
LIMIT 1;`,

  tags:["JOIN","ORDER BY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Customer Orders
// =======================

{
  id:10,
  language:"sql",
  concept:"join",
  difficulty:"hard",
  xp:120,

  title:"Customer Order Details",

  statement:
  "Display customer names along with their order IDs and order amounts.",

  inputFormat:
  "Customers(customer_id,name)\nOrders(order_id,customer_id,amount)",

  outputFormat:
  "Customer Order Amount",

  sampleInput:`Customers & Orders`,

  sampleOutput:`John 1001 2500
Alice 1002 1800`,

  constraints:"None",

  explanation:"Join Customers and Orders tables using customer_id.",

  starterCode:`SELECT c.name,o.order_id,o.amount
FROM Customers c
JOIN Orders o
ON ;`,

  tags:["JOIN","INNER JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

],

subqueries:[

  // =======================
// 1. Employees with Maximum Salary
// =======================

{
  id:1,
  language:"sql",
  concept:"subqueries",
  difficulty:"easy",
  xp:20,

  title:"Employee with Maximum Salary",

  statement:
  "Write a SQL query to display the employee(s) who earn the highest salary.",

  inputFormat:
  "Employees(emp_id, name, salary)",

  outputFormat:
  "Employee Details",

  sampleInput:`Employees`,

  sampleOutput:`John 90000`,

  constraints:"None",

  explanation:"Use a subquery to find the maximum salary.",

  starterCode:`SELECT *
FROM Employees
WHERE salary = (
    SELECT
);`,

  tags:["Subquery","MAX"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Employees Above Average Salary
// =======================

{
  id:2,
  language:"sql",
  concept:"subqueries",
  difficulty:"easy",
  xp:30,

  title:"Above Average Salary",

  statement:
  "Display employees whose salary is greater than the average salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees`,

  sampleOutput:`John
David`,

  constraints:"None",

  explanation:"Use AVG() inside a subquery.",

  starterCode:`SELECT *
FROM Employees
WHERE salary >
(
   SELECT
);`,

  tags:["Subquery","AVG"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Second Highest Salary
// =======================

{
  id:3,
  language:"sql",
  concept:"subqueries",
  difficulty:"medium",
  xp:40,

  title:"Second Highest Salary",

  statement:
  "Find the employee(s) with the second highest salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Employee Details",

  sampleInput:`Employees`,

  sampleOutput:`Alice 85000`,

  constraints:"None",

  explanation:"Use a nested subquery with MAX().",

  starterCode:`SELECT *
FROM Employees
WHERE salary =
(
   SELECT
);`,

  tags:["Subquery","Nested"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Employees in Sales Department
// =======================

{
  id:4,
  language:"sql",
  concept:"subqueries",
  difficulty:"medium",
  xp:50,

  title:"Employees in Sales Department",

  statement:
  "Display employees who belong to the Sales department using a subquery.",

  inputFormat:
  "Employees, Departments",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees & Departments`,

  sampleOutput:`David`,

  constraints:"None",

  explanation:"Find department_id using a subquery.",

  starterCode:`SELECT *
FROM Employees
WHERE dept_id =
(
   SELECT
);`,

  tags:["Subquery"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Customers Who Placed Orders
// =======================

{
  id:5,
  language:"sql",
  concept:"subqueries",
  difficulty:"medium",
  xp:60,

  title:"Customers with Orders",

  statement:
  "Display customers who have placed at least one order.",

  inputFormat:
  "Customers, Orders",

  outputFormat:
  "Customer Details",

  sampleInput:`Customers & Orders`,

  sampleOutput:`John
Alice`,

  constraints:"None",

  explanation:"Use IN with a subquery.",

  starterCode:`SELECT *
FROM Customers
WHERE customer_id IN
(
   SELECT
);`,

  tags:["IN","Subquery"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Employees Without Orders
// =======================

{
  id:6,
  language:"sql",
  concept:"subqueries",
  difficulty:"medium",
  xp:70,

  title:"Employees Without Projects",

  statement:
  "Display employees who are not assigned to any project.",

  inputFormat:
  "Employees, Projects",

  outputFormat:
  "Employee Details",

  sampleInput:`Employees & Projects`,

  sampleOutput:`Alice`,

  constraints:"None",

  explanation:"Use NOT IN with a subquery.",

  starterCode:`SELECT *
FROM Employees
WHERE emp_id NOT IN
(
   SELECT
);`,

  tags:["NOT IN","Subquery"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. EXISTS Subquery
// =======================

{
  id:7,
  language:"sql",
  concept:"subqueries",
  difficulty:"hard",
  xp:80,

  title:"Employees with Orders",

  statement:
  "Display employees who have at least one order using EXISTS.",

  inputFormat:
  "Employees, Orders",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees & Orders`,

  sampleOutput:`John`,

  constraints:"None",

  explanation:"Use EXISTS with a correlated subquery.",

  starterCode:`SELECT *
FROM Employees e
WHERE EXISTS
(
   SELECT *
   FROM Orders o
   WHERE
);`,

  tags:["EXISTS"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. ANY Operator
// =======================

{
  id:8,
  language:"sql",
  concept:"subqueries",
  difficulty:"hard",
  xp:90,

  title:"Salary Greater Than Any HR Employee",

  statement:
  "Display employees whose salary is greater than ANY salary of employees in the HR department.",

  inputFormat:
  "Employees",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees`,

  sampleOutput:`David`,

  constraints:"None",

  explanation:"Use ANY with a subquery.",

  starterCode:`SELECT *
FROM Employees
WHERE salary > ANY
(
   SELECT
);`,

  tags:["ANY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. ALL Operator
// =======================

{
  id:9,
  language:"sql",
  concept:"subqueries",
  difficulty:"hard",
  xp:100,

  title:"Salary Greater Than All HR Employees",

  statement:
  "Display employees whose salary is greater than ALL salaries of employees in the HR department.",

  inputFormat:
  "Employees",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees`,

  sampleOutput:`John`,

  constraints:"None",

  explanation:"Use ALL with a subquery.",

  starterCode:`SELECT *
FROM Employees
WHERE salary > ALL
(
   SELECT
);`,

  tags:["ALL"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Correlated Subquery
// =======================

{
  id:10,
  language:"sql",
  concept:"subqueries",
  difficulty:"hard",
  xp:120,

  title:"Employees Above Department Average",

  statement:
  "Display employees whose salary is greater than the average salary of their own department.",

  inputFormat:
  "Employees",

  outputFormat:
  "Matching Employees",

  sampleInput:`Employees`,

  sampleOutput:`John
Alice`,

  constraints:"None",

  explanation:"Use a correlated subquery.",

  starterCode:`SELECT *
FROM Employees e1
WHERE salary >
(
   SELECT AVG(salary)
   FROM Employees e2
   WHERE e1.dept_id = e2.dept_id
);`,

  tags:["Correlated Subquery"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

views:[
  // =======================
// 1. Create a Simple View
// =======================

{
  id:1,
  language:"sql",
  concept:"views",
  difficulty:"easy",
  xp:20,

  title:"Create Employee View",

  statement:
  "Create a view named EmployeeView that displays emp_id, name and salary from the Employees table.",

  inputFormat:
  "Employees(emp_id, name, salary, department)",

  outputFormat:
  "EmployeeView created.",

  sampleInput:`Employees`,

  sampleOutput:`View Created`,

  constraints:"None",

  explanation:"Use CREATE VIEW statement.",

  starterCode:`CREATE VIEW EmployeeView AS
SELECT ;`,

  tags:["CREATE VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Display Data from View
// =======================

{
  id:2,
  language:"sql",
  concept:"views",
  difficulty:"easy",
  xp:30,

  title:"Retrieve Data from View",

  statement:
  "Write a query to display all records from EmployeeView.",

  inputFormat:
  "EmployeeView",

  outputFormat:
  "Employee Details",

  sampleInput:`EmployeeView`,

  sampleOutput:`1 John 60000`,

  constraints:"None",

  explanation:"Use SELECT on the view.",

  starterCode:`SELECT * FROM ;`,

  tags:["SELECT","VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. View with WHERE Clause
// =======================

{
  id:3,
  language:"sql",
  concept:"views",
  difficulty:"easy",
  xp:40,

  title:"High Salary View",

  statement:
  "Create a view that contains employees whose salary is greater than 50000.",

  inputFormat:
  "Employees table",

  outputFormat:
  "View Created",

  sampleInput:`Employees`,

  sampleOutput:`HighSalaryView`,

  constraints:"None",

  explanation:"Use WHERE inside CREATE VIEW.",

  starterCode:`CREATE VIEW HighSalaryView AS
SELECT *
FROM Employees
WHERE ;`,

  tags:["VIEW","WHERE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. View with JOIN
// =======================

{
  id:4,
  language:"sql",
  concept:"views",
  difficulty:"medium",
  xp:50,

  title:"Employee Department View",

  statement:
  "Create a view showing employee names and department names using JOIN.",

  inputFormat:
  "Employees, Departments",

  outputFormat:
  "View Created",

  sampleInput:`Employees & Departments`,

  sampleOutput:`John IT`,

  constraints:"None",

  explanation:"Create a JOIN view.",

  starterCode:`CREATE VIEW EmployeeDeptView AS
SELECT ;
`,

  tags:["VIEW","JOIN"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Update Through View
// =======================

{
  id:5,
  language:"sql",
  concept:"views",
  difficulty:"medium",
  xp:60,

  title:"Update Data Using View",

  statement:
  "Update an employee's salary through EmployeeView.",

  inputFormat:
  "EmployeeView",

  outputFormat:
  "Row Updated",

  sampleInput:`EmployeeView`,

  sampleOutput:`Update Successful`,

  constraints:"View is updatable.",

  explanation:"Use UPDATE on the view.",

  starterCode:`UPDATE EmployeeView
SET salary = 65000
WHERE emp_id = 1;`,

  tags:["UPDATE","VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Replace View
// =======================

{
  id:6,
  language:"sql",
  concept:"views",
  difficulty:"medium",
  xp:70,

  title:"Replace Existing View",

  statement:
  "Modify EmployeeView using CREATE OR REPLACE VIEW.",

  inputFormat:
  "Employees table",

  outputFormat:
  "View Replaced",

  sampleInput:`Employees`,

  sampleOutput:`View Updated`,

  constraints:"None",

  explanation:"Use CREATE OR REPLACE VIEW.",

  starterCode:`CREATE OR REPLACE VIEW EmployeeView AS
SELECT ;`,

  tags:["REPLACE VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Drop View
// =======================

{
  id:7,
  language:"sql",
  concept:"views",
  difficulty:"medium",
  xp:80,

  title:"Delete a View",

  statement:
  "Delete the EmployeeView from the database.",

  inputFormat:
  "EmployeeView",

  outputFormat:
  "View Deleted",

  sampleInput:`EmployeeView`,

  sampleOutput:`View Dropped`,

  constraints:"None",

  explanation:"Use DROP VIEW.",

  starterCode:`DROP VIEW ;`,

  tags:["DROP VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Read-Only View
// =======================

{
  id:8,
  language:"sql",
  concept:"views",
  difficulty:"hard",
  xp:90,

  title:"Create Read Only View",

  statement:
  "Create a view that cannot be updated using WITH READ ONLY.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Read Only View Created",

  sampleInput:`Employees`,

  sampleOutput:`View Created`,

  constraints:"None",

  explanation:"Use WITH READ ONLY clause.",

  starterCode:`CREATE VIEW EmployeeView AS
SELECT *
FROM Employees
WITH READ ONLY;`,

  tags:["READ ONLY VIEW"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. View with Aggregate Function
// =======================

{
  id:9,
  language:"sql",
  concept:"views",
  difficulty:"hard",
  xp:100,

  title:"Department Salary Summary View",

  statement:
  "Create a view that displays department names and their average salaries.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Department Average Salary",

  sampleInput:`Employees`,

  sampleOutput:`IT 65000`,

  constraints:"None",

  explanation:"Use GROUP BY inside CREATE VIEW.",

  starterCode:`CREATE VIEW DepartmentSalaryView AS
SELECT ;`,

  tags:["VIEW","GROUP BY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Complex View
// =======================

{
  id:10,
  language:"sql",
  concept:"views",
  difficulty:"hard",
  xp:120,

  title:"Top Employees View",

  statement:
  "Create a view that displays employees earning more than the average salary.",

  inputFormat:
  "Employees table",

  outputFormat:
  "Top Employee Records",

  sampleInput:`Employees`,

  sampleOutput:`John 90000`,

  constraints:"None",

  explanation:"Use a subquery inside CREATE VIEW.",

  starterCode:`CREATE VIEW TopEmployees AS
SELECT *
FROM Employees
WHERE salary >
(
    SELECT AVG(salary)
    FROM Employees
);`,

  tags:["VIEW","SUBQUERY"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},
],

storedProcedures:[

  // =======================
// 1. Create a Simple Stored Procedure
// =======================

{
  id:1,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"easy",
  xp:20,

  title:"Create a Stored Procedure",

  statement:
  "Create a stored procedure named GetEmployees that displays all employee records.",

  inputFormat:
  "Employees(emp_id, name, salary)",

  outputFormat:
  "All employee records.",

  sampleInput:`Employees`,

  sampleOutput:`1 John 50000
2 Alice 60000`,

  constraints:"None",

  explanation:"Use CREATE PROCEDURE and SELECT statement.",

  starterCode:`CREATE PROCEDURE GetEmployees
AS
BEGIN

END;`,

  tags:["Stored Procedure","CREATE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 2. Execute Stored Procedure
// =======================

{
  id:2,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"easy",
  xp:30,

  title:"Execute a Stored Procedure",

  statement:
  "Execute the stored procedure named GetEmployees.",

  inputFormat:
  "Stored Procedure",

  outputFormat:
  "Employee Details",

  sampleInput:`GetEmployees`,

  sampleOutput:`Employee Records`,

  constraints:"None",

  explanation:"Use EXEC statement.",

  starterCode:`EXEC ;`,

  tags:["EXEC"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 3. Procedure with Input Parameter
// =======================

{
  id:3,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"easy",
  xp:40,

  title:"Employee by Department",

  statement:
  "Create a stored procedure that accepts a department name and displays all employees in that department.",

  inputFormat:
  "Department Name",

  outputFormat:
  "Employee Details",

  sampleInput:`IT`,

  sampleOutput:`John
David`,

  constraints:"None",

  explanation:"Use input parameters.",

  starterCode:`CREATE PROCEDURE GetEmployeesByDepartment
@Department VARCHAR(50)
AS
BEGIN

END;`,

  tags:["Parameter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 4. Procedure with Multiple Parameters
// =======================

{
  id:4,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"medium",
  xp:50,

  title:"Employees by Department and Salary",

  statement:
  "Create a stored procedure that displays employees from a department whose salary is greater than a given value.",

  inputFormat:
  "Department, Salary",

  outputFormat:
  "Employee Details",

  sampleInput:`IT
50000`,

  sampleOutput:`John`,

  constraints:"None",

  explanation:"Use multiple input parameters.",

  starterCode:`CREATE PROCEDURE GetEmployeeDetails
@Department VARCHAR(50),
@Salary INT
AS
BEGIN

END;`,

  tags:["Multiple Parameters"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 5. Procedure with Output Parameter
// =======================

{
  id:5,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"medium",
  xp:60,

  title:"Employee Count",

  statement:
  "Create a stored procedure that returns the total number of employees using an output parameter.",

  inputFormat:
  "Employees Table",

  outputFormat:
  "Employee Count",

  sampleInput:`Employees`,

  sampleOutput:`25`,

  constraints:"None",

  explanation:"Use OUTPUT parameter.",

  starterCode:`CREATE PROCEDURE GetEmployeeCount
@Count INT OUTPUT
AS
BEGIN

END;`,

  tags:["OUTPUT Parameter"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 6. Insert using Procedure
// =======================

{
  id:6,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"medium",
  xp:70,

  title:"Insert Employee",

  statement:
  "Create a stored procedure to insert a new employee record.",

  inputFormat:
  "Employee Details",

  outputFormat:
  "Record Inserted",

  sampleInput:`John
IT
50000`,

  sampleOutput:`1 Row Inserted`,

  constraints:"None",

  explanation:"Use INSERT inside a stored procedure.",

  starterCode:`CREATE PROCEDURE AddEmployee
@Name VARCHAR(50),
@Department VARCHAR(50),
@Salary INT
AS
BEGIN

END;`,

  tags:["INSERT"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 7. Update using Procedure
// =======================

{
  id:7,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"medium",
  xp:80,

  title:"Update Employee Salary",

  statement:
  "Create a stored procedure to update an employee's salary using employee ID.",

  inputFormat:
  "Employee ID, Salary",

  outputFormat:
  "Row Updated",

  sampleInput:`1
65000`,

  sampleOutput:`Update Successful`,

  constraints:"None",

  explanation:"Use UPDATE inside procedure.",

  starterCode:`CREATE PROCEDURE UpdateSalary
@EmpId INT,
@Salary INT
AS
BEGIN

END;`,

  tags:["UPDATE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 8. Delete using Procedure
// =======================

{
  id:8,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"hard",
  xp:90,

  title:"Delete Employee",

  statement:
  "Create a stored procedure to delete an employee using employee ID.",

  inputFormat:
  "Employee ID",

  outputFormat:
  "Row Deleted",

  sampleInput:`5`,

  sampleOutput:`Delete Successful`,

  constraints:"None",

  explanation:"Use DELETE statement inside the procedure.",

  starterCode:`CREATE PROCEDURE DeleteEmployee
@EmpId INT
AS
BEGIN

END;`,

  tags:["DELETE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 9. Procedure with IF Condition
// =======================

{
  id:9,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"hard",
  xp:100,

  title:"Check Employee Salary",

  statement:
  "Create a stored procedure that prints 'High Salary' if salary is greater than 50000, otherwise prints 'Low Salary'.",

  inputFormat:
  "Salary",

  outputFormat:
  "High Salary / Low Salary",

  sampleInput:`70000`,

  sampleOutput:`High Salary`,

  constraints:"None",

  explanation:"Use IF...ELSE inside a stored procedure.",

  starterCode:`CREATE PROCEDURE CheckSalary
@Salary INT
AS
BEGIN

END;`,

  tags:["IF ELSE"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

// =======================
// 10. Procedure with Transaction
// =======================

{
  id:10,
  language:"sql",
  concept:"stored-procedure",
  difficulty:"hard",
  xp:120,

  title:"Transfer Salary",

  statement:
  "Create a stored procedure to transfer salary between two employee accounts using a transaction.",

  inputFormat:
  "From Employee ID, To Employee ID, Amount",

  outputFormat:
  "Transaction Successful",

  sampleInput:`1
2
5000`,

  sampleOutput:`Transfer Completed`,

  constraints:"Amount > 0",

  explanation:"Use BEGIN TRANSACTION, COMMIT and ROLLBACK inside the stored procedure.",

  starterCode:`CREATE PROCEDURE TransferSalary
@FromEmp INT,
@ToEmp INT,
@Amount INT
AS
BEGIN

END;`,

  tags:["Transaction","Stored Procedure"],

  timeLimit:"1 sec",
  memoryLimit:"256 MB"
},

]












};

export default codingQuestions;