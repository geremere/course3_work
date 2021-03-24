package com.example.polls;

public class testMain {

    private boolean hasI(){
        return true;
    }
    public static void main(String[] args)  {
        testMain t = new tt();
        System.out.print(t.hasI());

    }
}

class tt extends testMain{
    public boolean hasI(){
        return false;
    }
}
