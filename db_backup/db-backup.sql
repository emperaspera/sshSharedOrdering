PGDMP      3                |            ssh    16.2    16.2 G    D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            G           1262    26865    ssh    DATABASE        CREATE DATABASE ssh WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE ssh;
                postgres    false            �            1259    26904 
   categories    TABLE     �   CREATE TABLE public.categories (
    category_id integer NOT NULL,
    supermarket_id integer,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    26903    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    222            H           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    221            �            1259    26867 
   households    TABLE     �   CREATE TABLE public.households (
    household_id integer NOT NULL,
    address text NOT NULL,
    pin_password text NOT NULL,
    coordinate_x integer NOT NULL,
    coordinate_y integer NOT NULL
);
    DROP TABLE public.households;
       public         heap    postgres    false            �            1259    26866    households_household_id_seq    SEQUENCE     �   CREATE SEQUENCE public.households_household_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.households_household_id_seq;
       public          postgres    false    216            I           0    0    households_household_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.households_household_id_seq OWNED BY public.households.household_id;
          public          postgres    false    215            �            1259    26949    order_items    TABLE     �  CREATE TABLE public.order_items (
    item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    user_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    delivery_fee_share numeric(10,2),
    service_fee_share numeric(10,2),
    user_total numeric(10,2),
    tax_share numeric(10,2) DEFAULT 0
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    26948    order_items_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.order_items_item_id_seq;
       public          postgres    false    228            J           0    0    order_items_item_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.order_items_item_id_seq OWNED BY public.order_items.item_id;
          public          postgres    false    227            �            1259    26928    orders    TABLE     �  CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    household_id integer,
    is_shared boolean DEFAULT false,
    total_cost numeric(10,2),
    delivery_fee numeric(10,2),
    service_fee numeric(10,2),
    status character varying(20) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_date date NOT NULL,
    tax numeric(10,2) DEFAULT 0
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    26927    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public          postgres    false    226            K           0    0    orders_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
          public          postgres    false    225            �            1259    26972    payments    TABLE     #  CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.payments;
       public         heap    postgres    false            �            1259    26971    payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_payment_id_seq;
       public          postgres    false    230            L           0    0    payments_payment_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;
          public          postgres    false    229            �            1259    26918    products    TABLE     "  CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category character varying(50),
    image_url text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    26917    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    224            M           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    223            �            1259    26895    supermarkets    TABLE       CREATE TABLE public.supermarkets (
    supermarket_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    rating numeric(3,2),
    image_url text,
    address text,
    coordinate_x integer NOT NULL,
    coordinate_y integer NOT NULL
);
     DROP TABLE public.supermarkets;
       public         heap    postgres    false            �            1259    26894    supermarkets_supermarket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supermarkets_supermarket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.supermarkets_supermarket_id_seq;
       public          postgres    false    220            N           0    0    supermarkets_supermarket_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.supermarkets_supermarket_id_seq OWNED BY public.supermarkets.supermarket_id;
          public          postgres    false    219            �            1259    26876    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    household_id integer,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    pin_password text,
    phone_number character varying(15),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_blocked boolean DEFAULT false,
    balance numeric(10,2) DEFAULT 0
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    26875    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    218            O           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    217            y           2604    26907    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    221    222    222            s           2604    26870    households household_id    DEFAULT     �   ALTER TABLE ONLY public.households ALTER COLUMN household_id SET DEFAULT nextval('public.households_household_id_seq'::regclass);
 F   ALTER TABLE public.households ALTER COLUMN household_id DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    26952    order_items item_id    DEFAULT     z   ALTER TABLE ONLY public.order_items ALTER COLUMN item_id SET DEFAULT nextval('public.order_items_item_id_seq'::regclass);
 B   ALTER TABLE public.order_items ALTER COLUMN item_id DROP DEFAULT;
       public          postgres    false    227    228    228            |           2604    26931    orders order_id    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    26975    payments payment_id    DEFAULT     z   ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);
 B   ALTER TABLE public.payments ALTER COLUMN payment_id DROP DEFAULT;
       public          postgres    false    229    230    230            z           2604    26921    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    223    224    224            x           2604    26898    supermarkets supermarket_id    DEFAULT     �   ALTER TABLE ONLY public.supermarkets ALTER COLUMN supermarket_id SET DEFAULT nextval('public.supermarkets_supermarket_id_seq'::regclass);
 J   ALTER TABLE public.supermarkets ALTER COLUMN supermarket_id DROP DEFAULT;
       public          postgres    false    220    219    220            t           2604    26879    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    218    217    218            9          0    26904 
   categories 
   TABLE DATA           G   COPY public.categories (category_id, supermarket_id, name) FROM stdin;
    public          postgres    false    222   CZ       3          0    26867 
   households 
   TABLE DATA           e   COPY public.households (household_id, address, pin_password, coordinate_x, coordinate_y) FROM stdin;
    public          postgres    false    216   �Z       ?          0    26949    order_items 
   TABLE DATA           �   COPY public.order_items (item_id, order_id, product_id, user_id, quantity, unit_price, subtotal, delivery_fee_share, service_fee_share, user_total, tax_share) FROM stdin;
    public          postgres    false    228   �[       =          0    26928    orders 
   TABLE DATA           �   COPY public.orders (order_id, user_id, household_id, is_shared, total_cost, delivery_fee, service_fee, status, created_at, delivery_date, tax) FROM stdin;
    public          postgres    false    226   \       A          0    26972    payments 
   TABLE DATA           c   COPY public.payments (payment_id, order_id, user_id, amount, status, transaction_date) FROM stdin;
    public          postgres    false    230   \       ;          0    26918    products 
   TABLE DATA           i   COPY public.products (product_id, name, description, price, category, image_url, updated_at) FROM stdin;
    public          postgres    false    224   <\       7          0    26895    supermarkets 
   TABLE DATA           �   COPY public.supermarkets (supermarket_id, name, description, rating, image_url, address, coordinate_x, coordinate_y) FROM stdin;
    public          postgres    false    220   -n       5          0    26876    users 
   TABLE DATA           �   COPY public.users (user_id, household_id, first_name, last_name, email, password_hash, pin_password, phone_number, address, created_at, is_blocked, balance) FROM stdin;
    public          postgres    false    218   �o       P           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 30, true);
          public          postgres    false    221            Q           0    0    households_household_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.households_household_id_seq', 3, true);
          public          postgres    false    215            R           0    0    order_items_item_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.order_items_item_id_seq', 1, false);
          public          postgres    false    227            S           0    0    orders_order_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);
          public          postgres    false    225            T           0    0    payments_payment_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.payments_payment_id_seq', 1, false);
          public          postgres    false    229            U           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    223            V           0    0    supermarkets_supermarket_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.supermarkets_supermarket_id_seq', 1, false);
          public          postgres    false    219            W           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 9, true);
          public          postgres    false    217            �           2606    26909    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    222            �           2606    26911 -   categories categories_supermarket_id_name_key 
   CONSTRAINT     x   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_name_key UNIQUE (supermarket_id, name);
 W   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_name_key;
       public            postgres    false    222    222            �           2606    26874    households households_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public            postgres    false    216            �           2606    26955    order_items order_items_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (item_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    228            �           2606    26937    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    226            �           2606    26979    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    230            �           2606    26926    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    224            �           2606    26902    supermarkets supermarkets_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.supermarkets
    ADD CONSTRAINT supermarkets_pkey PRIMARY KEY (supermarket_id);
 H   ALTER TABLE ONLY public.supermarkets DROP CONSTRAINT supermarkets_pkey;
       public            postgres    false    220            �           2606    26888    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            �           2606    26886    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            �           2606    26912 )   categories categories_supermarket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_fkey FOREIGN KEY (supermarket_id) REFERENCES public.supermarkets(supermarket_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_fkey;
       public          postgres    false    4749    222    220            �           2606    26956 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    226    228    4757            �           2606    26961 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    224    4755    228            �           2606    26966 $   order_items order_items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_user_id_fkey;
       public          postgres    false    228    4747    218            �           2606    26943    orders orders_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_household_id_fkey;
       public          postgres    false    226    4743    216            �           2606    26938    orders orders_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public          postgres    false    4747    218    226            �           2606    26980    payments payments_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_order_id_fkey;
       public          postgres    false    230    4757    226            �           2606    26985    payments payments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_user_id_fkey;
       public          postgres    false    218    230    4747            �           2606    26889    users users_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_household_id_fkey;
       public          postgres    false    4743    218    216            9   �   x�M��
�0�����Hgri��Wn��Rm|{4ig���!�������!/���3;��wz<g��)�ӏt��<�O"i��w8˸ױ4�!W碰ً�]��R�)D�[��m��]=����
���
��:ܥ�.� �B��Z�:ܵ��k�5�^���uYj�      3   �   x�M�KR�0  �ur
�i���L���v�P�
T)������<0�֦����M�&G#{־V?d{M��
����r^L�w!����|��u�I�?�s�������k�����4):�1Fva��o��&��|,��R劣ż޾��O�I���(��� �x��j�eqv�1m8��� j��������k��b
ҋ��w�k��~:�?�@D�      ?      x������ � �      =      x������ � �      A      x������ � �      ;      x����r�E�G_��4}����Uq�eU�+���	� `��3 H*!)���F��E��{ ̅���?l�ˡ����z���~�8|�x��Y��������/˲ū���r1u��g�U5�_��U����p�-��46�L�U�wezY�*U������X����Anb,^/o��a�[��c�����47;?���V{u�&Vŏ�����"Y�q��V?��ڋ�[�yM��b�YY�r㦵����j�Łխ�sܼ��e7������os�&��x3��k/,q{���c������p���qV�Y���?��h�w���X�٬��C��Nt���e�����]����������ⷱ�n5,�SCK���~�]����b;l�Ãwٿ����_.��6�Z�����r�:;O�K4���f>�,�A܎�������xy*�����~x7��v�Ɇ+���w�}�\�_n>��>��O}�������~�[�p��q��t+���߬.ɺ^��H?>?��q	��:���wXð�����ϯ�⯎Sg��~���e�xx�{:.s����U��6~rM�=�����x9|t��t6\��<�o����p���o���Ǳ3z����
���p�?Ԕ�?n����\cZ��Ϸ#���<w=��b����݃��~|?<��Ư58����i��n�_b<�]o�c���|����^�q�����gǙ�ۙ~�x:럊8�qة�N��wIˡ?\?<�?N�?�u�n����#�z��/.{�m����f�q~|]������b}sp���W�a��0?�)~���_�7_"�ߜ'�^[����D��R� vśe�@o���~{���i|t�l���U�'�����b>�����]���a��0?ڊ���0�շ���yX��`������D�D,��~5\��q��r��y��<�@*~������A�����Y�q�\��P��{K�~�������pxx��/v�\l�עO?���4�l���ûwq�(�r��.��q~�����px�L������8��t_�t�~��������-�¯�óّ/�8ˏ���[m>�w�r�;��L�k�]�m�[�����%?
w��
����	��������qx�x�W��~8N���Fj��I����a�)l�L��������,�;���^77;��`��q}U���T�/�~v��<��w��7W7�����Ͽ�X��Ӱ�i��YTޅ���o��o�O���P��=�ƿ1���է�Ͽ��Ç���:��������U�K��v�{���d�J�r��W9>�><�?�o�P�7��^��	u� l޿���>�ZǏ�i�_�:W8�铰v[DxN-Ʊ��x[�_�l��=YD8�"lc�n���m��+{�E�������3���
�'v����Ĺ�E����'�b�(QIn�6�m��ӛ�O�P��l�y���w��X����t�����A:;���~�����l�?��k�����y$�u��Q���������>,�+�@�~*0���W�1�TO�&5���D'5�H'����tO�r!�Ԗ�O���(yyPj�Jn"�"F��<�(��3J^"��f��Dv+�֔Qy��m$F��ė��%7Z`��Ne��t�Q�J�Q��F��R31�ԙ�(��Q��(�t�(uIc�X6z��F��cF��F	�����Q%M���%���`�P��(�q�)�|)�2h����N(MĔH8ŔBs8%TA�B�4P�4��R(+�T"�T
e��*��J�l�X%���*���`%���B�ɴ���J!�*���p���+y���e K^X
��3B"��
�B�%7]@�B�f�M��R�-y��B�A-yTj)�VƖ��B'qK^:疂������K�&��Iȥ`&�KN��.�2�@v)X�%��X�`�F/�pD/�s�%�@���5:��Z`~)X� LN:��u�`r2�b	&'!L!�a���I��.@L!F�br�5�)�$bLN��1�X�KgS�u�4>�LN2���LR�2��
0i�h�;g"�
�R�4��h
)d!MR(H�CM��B5�3�&��<��2�&^�
'R��6�&��!�"�DZ`�)�FśH>�BjE���c�)�NA�H6c�BU�AN��@9�*p�4�P)��4L��ELS��B���&�1���&�1�J02M�d
�2Mbe
��e�F�*E�4����Lٙj�g���T���	M��h���T뒦i-M��i��Ӕ#j
���jY��:`WS�ʚP>�5բ�	��'�&G�`*4���ţm�F�6�pJD�F�6�x�D�&G��(TT���P�E5��	eS"�Q�M(�QM���u�ȨFT8�
�je���lT��q
S{�B�'rEd:�UN~�ju���/�Q��srh�T+
��x��js�Nn�jU��[Ab�ZU���+�T����hJIu���MV0�.G��6�9�N�;�%4P��On�@Ju9�'���Ju\���<�N�<y�*,��'Z��R��z��`�({�鈗�2K�+���G:0k`b�JI���sd�J,}�B3e%�>yy��R?�`���RS?y�6e�,��5n�JU���K��U �9e!S���B�J*�)��4@䔅IW�)y*(܃�S�dPR�h!CEz(䔅!oA�W"�(�x�l�)��M�橙��"-09e&��H>'��T5��䔙$�"ٌ�2��C�
9e�QaC����r3!9e�J��d��24Qn2$�,bQ���)�\�&2r�"�E������uQn"#�,
�(7�^*#WF����)biI$߹�i��T~�8��)��:�͗�)K�<ʍ�)K9��0�?ʒ,�b(9eIUH�|JNY%R0�=���l���.I")���.�*)���.�2)���.G'�H�y���P��w�(�B��;�*�(���7�UYJ)�A��JtJ�
���J�J�xLNY�c�
Sk����J�"*9e���;pr�*],��k�ղY�m �SV�j)7^ ���qK�Tr�jU.�VP�)�U��/�SV+z)?�SV�~)7Y ���L�Tr�j�0嗐�)�5Ŕ��)krSn����K��4�)kt˔-�S��)Z�S֨�)Z�a�(��錜j�LS��BN5�)X��S����r���)/�S-�Myy��ju�	VȩV�My�
9���)/]$�Z�8��k�T�*�`<$��L�}电��)�%�Z�9E0r��pN�t����S��@Nuy�)�
��2�S��DNu9�)ނ�St9�)^�nw��)�D�<�T�i�ɩNvN�|���T����T'9�H6#�b���r*��9e�8�b)8��LHN�RuN��9K�9�&Cr*��9�F"r*��9�&2r*��9�'r*��9�&2r*��s�̈́���s��d7L1`�Ig�9��T|�AuN��9��r�%r*�9���T9�)��9��b(9��B����AtN�t�D-�9`r*��b�d�.��bᔜ�&:�P<$���8�X����9�PFNE�S(C�T�J��T�,�렐S�D�� ɩe����T�9�)��9c�s
QɩE�߁�S1��)7_#�b��Sn���QtN��9c�s�m��S1��)��BNŨ:��x���IqN�ѐ��ItN��9S�s�m��S1��)��DNŤ9��xNNŔ�r��TL�9e�8�bҝS^�HNŤ;�hHNŤ:�h�5�JtN�tDN�*�9+�T�2�S�&�b%9��xNN�
;��PFNŊ:��<DN�JwN�`�������r*V�s�K�ȩX��)/_"�b�:�`<#�b�露o���u�sJ*ɩX+�)� �S��pN�t���u�s
���T��SR�Xg8�H���u�s����u�s�נ��M�s�76O�9EZ`r*6�s��sr*6�s��cr*6�s�dCr��tN�

9�p�M㜊���r3)9ը�)?Y!��9�&Sr���)7��S-wN����j�s�OD�T˝Sn"$�Z�9�f�Ke˝Sn&�aj�s�$�3q�9��T~�oU���S��r�5r��Sn�BNu9�)��9;�9�:`r�S�S �  (�S�蜂�쉤�qN����$��G[u��bᘜ�D����T��br*��s
`�T*E�ʆ�P*U�J��T*��S��BN�RtN�
��J��B�Je�sʦvN�2�9���T*E�߁�S�ԝSn�FN� ;��9���r�r*���@%�RP�Sn��JAuN��9����!9���r�r*���@%�RНS~	��JAsN��J��r��T2i�S�t�-�S�t�� ɩd�s�@XC2�9�9�,�9+�T����ɩd�sʋ��T2��B9�"uNyy��JQwN�`��JQsNy�9�����5r*E�9��K�T��s
�3r*�L�T�Ω3�SRHN��8�HDN���"�
9�R�s
���TJy�)�
�L)�9Ez(�TJ9�)��S����5�vpJ��)ބo���:�HLN�$;�H>'�RR�S$�S)I�)��ȩTe:�p�����/^��=�h      7   M  x���Mk�@���ػ�h�GS(��\�@ιL݉.�]�Y%���m�ы�,�3�)\S`%�*����:����ٜ�&�h�T��N"�1dq�@�}�/�E�1�+̩��"��k�I�G�$o��u��}@;��a��N�е�>�A\ʻk�Ŗ
��$<�1���v� �[H3���
<��p1���֒���%��:_jS��6C߾���7=�i
��+�Z�k��+8 ��`nMKF��Ӯ�a�:ཹ�a@4��A�k8�Sd��ٖ��
4:hn85��yn�1=���t%6���}�>O��J��A����������r;dFc~P7��X�����      5   /  x�}�ɒ�J�5�w�ۆ2zu,e�I%z�(�<����Qޅq���"�_|��&h⳸�Ģ�D|A��ͼ(%�EF�`�4��P�V�,K�%7����Ԝ�-� �fB<1�2�c�]d!� ��ݖ3.�B����L�D!;u���1����*�u3����J����0��?i�'M��/~�dY�� |0��c�̢�J���<���O�nzWn:�u���*��v��p�̫Qh)CVT��*����D�/\[�ݚ���ᶜW�������Ʈ��)���e����;�2§��2�b^C~7���^�":�d/Ƹ=��n��l�/<��� ��zi���c���i`��w9�8�Ҥ�9pX�1��v2�m��51B�9ea)��&Dv�΀�����`�e�����!�#��°)�]}��?��� 9�l�i�oL��8V�mգ�6��W͓��V8`j���n�#����brn�� �}��R��53�c�a�'=��ˉ�5j1�yx�F%e�U�)>VL��%P�5}%��5>i���S����B���.m�|�:�m�r�{��2�6�^��}�����q�ܐ��u63�amI6����x�O�`��G���b�{���S뙷m*5Z�sq�v>��>���#�y�h����r7f���.��N�Fd�4Rc���B:<V���6��� �W��eaaޠ�E�Go3��D��P����)��1Ή��ty/���E��kqoN�H�%ub�g��ilp_��*+�L�J�GY�u??31٬�Ǘ�e�z�������c�.Yz�'�U���#O��Ս|C�!B���_���)-��k���˶����l���Y��6:���R�$�G�B��2Ww�̶���r�ov���'j6�+r��}�e�L��.?�f����7���z"��k�+�C�6��C������1�f? �ڷ	�T%�e���Y����,Gɗ~��ِ�X����:��Ru��3E�jjkm��[(�ߙ��?M3_�O=��(<�/���XH?1�ɏ��?:
     