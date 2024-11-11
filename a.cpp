#include <bits/stdc++.h>
using namespace std;
#define ll long long

int main() {
    int t;
    cin >> t;
    while(t--){
       int l, r, k, cnt = 0;
       cin >> l >> r >> k;
       for(int i = l ; i <= r ; i++){
        if(i*k <= r){
            cnt++;
        }
        else{
            break;
        }
       } 
       cout << cnt << endl;
    }

    return 0;
}
