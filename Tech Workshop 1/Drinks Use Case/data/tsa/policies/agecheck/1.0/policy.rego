package policies.testqux

import future.keywords.in

default adult = false

adult = agecheck(input)

agecheck(i){
    exp := time.parse_ns("2006-01-02", i.Birthday)
    time.add_date(time.now_ns(), -18, 0, 0) > exp
}
